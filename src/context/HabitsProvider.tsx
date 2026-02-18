import React, { useState, useEffect, useMemo, type ReactNode } from "react";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  type CollectionReference,
  type DocumentData,
  type DocumentReference,
  query,
  orderBy,
  limit,
  where,
  documentId,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import type {
  AppNotification,
  DailyEntry,
  DailyEntryBase,
  HabitDefinition,
  SessionLogState,
} from "../types/data";
import { useAuth } from "./AuthContext";
import LoadingScreen from "../components/layout/LoadingScreen";
import { HabitsContext } from "./HabitsContext";

const formatISODate = (date: Date): string =>
  date.toISOString().substring(0, 10);

const getLastNDaysISOs = (n: number): string[] => {
  const dates: string[] = [];
  const currentDate = new Date();
  for (let i = 0; i < n; i++) {
    const isoDate = formatISODate(currentDate);
    dates.unshift(isoDate);
    currentDate.setDate(currentDate.getDate() - 1);
  }
  return dates;
};

const getUserPath = (uid: string): DocumentReference<DocumentData> => {
  const appId = typeof __app_id !== "undefined" ? __app_id : "default-app-id";
  return doc(db, "artifacts", appId, "users", uid);
};

const getUserHabitsCollection = (
  uid: string,
): CollectionReference<DocumentData> => collection(getUserPath(uid), "habits");

const getUserHistoricalDaysCollection = (
  uid: string,
): CollectionReference<DocumentData> => collection(getUserPath(uid), "days");

const getUserPlannedDaysCollection = (
  uid: string,
): CollectionReference<DocumentData> => collection(getUserPath(uid), "days");

export const HabitsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId, isAuthReady, isAuthLoading } = useAuth();

  const [historicalDaysMap, setHistoricalDaysMap] = useState<
    Map<string, DailyEntry>
  >(new Map());
  const [plannedDays, setPlannedDays] = useState<DailyEntry[]>([]);
  const [habits, setHabits] = useState<HabitDefinition[]>([]);

  const [calendarUrl, setCalendarUrl] = useState<string | null>(null);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);

  const [notification, setNotification] = useState<AppNotification | null>(
    null,
  );
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const isLoading = isAuthLoading || !isDataLoaded || isCalendarLoading;

  const todayISO = useMemo(() => formatISODate(new Date()), []);
  const tomorrowISO = useMemo(() => {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    return formatISODate(tomorrowDate);
  }, []);

  useEffect(() => {
    if (!isAuthReady || !userId) {
      if (isAuthReady) {
        setIsDataLoaded(true);
        setHistoricalDaysMap(new Map());
        setPlannedDays([]);
        setHabits([]);
        setCalendarUrl(null);
      }
      return;
    }

    setIsDataLoaded(false);

    const listenersStatus = {
      habits: false,
      historical: false,
      planned: false,
    };
    const checkAllLoaded = () => {
      if (Object.values(listenersStatus).every((status) => status === true)) {
        setIsDataLoaded(true);
      }
    };

    const fetchCalendarConfig = async () => {
      setIsCalendarLoading(true);
      const userDocRef = getUserPath(userId);
      try {
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const url = userSnap.data()?.calendar as string | undefined;
          setCalendarUrl(url || null);
        } else {
          setCalendarUrl(null);
        }
      } catch (error) {
        console.error("Error loading calendar URL:", error);
      } finally {
        setIsCalendarLoading(false);
      }
    };

    fetchCalendarConfig();

    const createListener = <T,>(
      collectionRef: CollectionReference,
      setState: React.Dispatch<React.SetStateAction<T[]>>,
      key: keyof typeof listenersStatus,
      mapper: (doc: DocumentData) => T,
    ) => {
      return onSnapshot(collectionRef, (snapshot) => {
        const loadedData = snapshot.docs.map((doc) => mapper(doc));
        setState(loadedData);
        listenersStatus[key] = true;
        checkAllLoaded();
      });
    };

    const unsubscribeHabits = createListener(
      getUserHabitsCollection(userId),
      setHabits,
      "habits",
      (doc) => ({ id: doc.id, ...doc.data() }) as HabitDefinition,
    );

    const daysCollectionRef = getUserHistoricalDaysCollection(userId);
    const daysQuery = query(
      daysCollectionRef,
      where("__name__", "<=", todayISO),
      orderBy("__name__", "desc"),
      limit(100),
    );

    const unsubscribeHistoricalDays = onSnapshot(daysQuery, (snapshot) => {
      const loadedDaysMap = new Map<string, DailyEntry>();
      snapshot.docs.forEach((doc) => {
        loadedDaysMap.set(doc.id, {
          date: doc.id,
          ...doc.data(),
        } as DailyEntry);
      });
      setHistoricalDaysMap(loadedDaysMap);
      listenersStatus.historical = true;
      checkAllLoaded();
    });

    const plannedDaysCollectionRef = getUserPlannedDaysCollection(userId);
    const requiredDates = [todayISO, tomorrowISO];

    const plannedDaysQuery = query(
      plannedDaysCollectionRef,
      where(documentId(), "in", requiredDates),
    );

    const unsubscribePlannedDays = onSnapshot(plannedDaysQuery, (snapshot) => {
      const loadedPlannedDays = snapshot.docs.map((doc) => ({
        date: doc.id,
        ...doc.data(),
      })) as DailyEntry[];

      setPlannedDays(
        loadedPlannedDays.sort((a, b) => a.date.localeCompare(b.date)),
      );
      listenersStatus.planned = true;
      checkAllLoaded();
    });

    return () => {
      unsubscribeHabits();
      unsubscribeHistoricalDays();
      unsubscribePlannedDays();
    };
  }, [isAuthReady, userId, todayISO, tomorrowISO]);

  const days = useMemo(() => {
    const last100DaysISOs = getLastNDaysISOs(100);

    const fullDayHistory: DailyEntryBase[] = last100DaysISOs.map((isoDate) => {
      const existingData = historicalDaysMap.get(isoDate);
      if (existingData) {
        return existingData;
      }

      return {
        date: isoDate,
        entries: [],
      } as DailyEntryBase;
    });
    return fullDayHistory;
  }, [historicalDaysMap]);

  const updatePlannedDay = async (
    dayToUpdate: DailyEntryBase,
  ): Promise<void> => {
    if (!userId)
      return console.error(
        "Cannot update planned day: User not authenticated.",
      );
    try {
      const dayDocRef = doc(
        getUserPlannedDaysCollection(userId),
        dayToUpdate.date,
      );

      await setDoc(dayDocRef, dayToUpdate, { merge: true });
    } catch (e) {
      console.error("Error updating planned day in Firestore: ", e);
    }
  };

  const updateDayEntries = async (
    date: string,
    newEntries: SessionLogState[],
  ): Promise<void> => {
    const dayToUpdate: DailyEntryBase = {
      date: date,
      entries: newEntries,
    };
    await updatePlannedDay(dayToUpdate);
  };

  const addHabit = async (
    newHabitData: Omit<HabitDefinition, "id">,
  ): Promise<void> => {
    if (!userId)
      return console.error("Cannot add habit: User not authenticated.");

    try {
      const newHabitRef = doc(getUserHabitsCollection(userId));
      const newHabit: HabitDefinition = {
        id: newHabitRef.id,
        ...newHabitData,
      };
      await setDoc(newHabitRef, newHabit);
    } catch (e) {
      console.error("Error adding habit to Firestore: ", e);
    }
  };

  const updateHabit = async (
    habitId: string,
    updates: Partial<Omit<HabitDefinition, "id">>,
  ): Promise<void> => {
    if (!userId)
      return console.error("Cannot update habit: User not authenticated.");
    try {
      const habitDocRef = doc(getUserHabitsCollection(userId), habitId);
      await updateDoc(habitDocRef, updates);
    } catch (e) {
      console.error("Error updating habit in Firestore: ", e);
    }
  };

  const logSession = async (
    entryDate: string,
    logData: Omit<SessionLogState, "id" | "date">,
  ): Promise<void> => {
    if (!userId)
      return console.error("Cannot log session: User not authenticated.");
    try {
      const newLog: SessionLogState = {
        ...logData,
      };

      const dayToUpdate = days.find((day) => day.date === entryDate);
      let updatedDay: DailyEntryBase;

      if (dayToUpdate) {
        updatedDay = {
          ...dayToUpdate,
          entries: [...dayToUpdate.entries],
        };
        const entryIndex = updatedDay.entries.findIndex(
          (entry) => entry.habitId === logData.habitId,
        );

        if (entryIndex !== -1) {
          updatedDay.entries[entryIndex] = logData;
        } else {
          console.warn("Logged habit was not planned for today. ADDING HABIT");

          updatedDay.entries.push(logData);
        }
      } else {
        updatedDay = {
          date: entryDate,
          entries: [newLog],
        };
        console.warn(`Day ${entryDate} created with first habit.`);
      }

      await updatePlannedDay(updatedDay);
    } catch (e) {
      console.error("Error during logSession and day update:", e);
    }
  };

  const softDeleteHabit = async (habitId: string): Promise<void> => {
    if (!userId)
      return console.error("Cannot soft delete habit: User not authenticated.");

    const habitToArchive = habits.find((h) => h.id === habitId);
    if (!habitToArchive) return;

    try {
      const habitDocRef = doc(getUserHabitsCollection(userId), habitId);

      await setDoc(habitDocRef, { deletedAt: todayISO }, { merge: true });

      setNotification({
        message: `${habitToArchive.name} archived.`,
        action: "RESTORE",
        targetHabitId: habitId,
      });
      setTimeout(clearNotification, 5000);
    } catch (e) {
      console.error("Error archiving habit in Firestore: ", e);
    }
  };

  const restoreHabit = async (habitId: string): Promise<void> => {
    if (!userId)
      return console.error("Cannot restore habit: User not authenticated.");

    clearNotification();
    try {
      const habitDocRef = doc(getUserHabitsCollection(userId), habitId);

      await setDoc(habitDocRef, { deletedAt: null }, { merge: true });
    } catch (e) {
      console.error("Error restoring habit in Firestore: ", e);
    }
  };

  const clearNotification = () => {
    setNotification(null);
  };

  const updateCalendarUrl = async (url: string): Promise<void> => {
    if (!userId) return;
    try {
      const userDocRef = getUserPath(userId);
      await updateDoc(userDocRef, { calendar: url });
      setCalendarUrl(url);
    } catch (e) {
      console.error("Error updating calendar URL:", e);
    }
  };

  return (
    <HabitsContext.Provider
      value={{
        days,
        plannedDays,
        habits,
        updatePlannedDay,
        updateDayEntries,
        addHabit,
        updateHabit,
        logSession,
        softDeleteHabit,
        restoreHabit,
        notification,
        isLoading,
        calendarUrl,
        isCalendarLoading,
        updateCalendarUrl,
      }}
    >
      {isAuthReady && !isDataLoaded ? (
        <LoadingScreen message="Loading application data..." />
      ) : (
        children
      )}
    </HabitsContext.Provider>
  );
};
