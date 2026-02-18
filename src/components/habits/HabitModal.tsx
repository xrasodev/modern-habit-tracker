import React, { useState, useCallback } from "react";
import { DialogTitle } from "@headlessui/react";
import type { HabitDefinition } from "../../types/data";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

// Tipos locales para el formulario
interface HabitFormState {
  color: string;
  name: string;
  targetTimeMinutes: number;
  description: string;
}

interface NewHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  // La función que se ejecutará al guardar (maneja Creación o Edición)
  onSave: (habitData: HabitFormState) => void;
  // Hábito a editar (null para creación)
  habitToEdit: HabitDefinition | null;
}

const defaultFormData: HabitFormState = {
  color: "lime-600",
  name: "",
  targetTimeMinutes: 30,
  description: "",
};

const NewHabitModal: React.FC<NewHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  habitToEdit,
}) => {
  // Inicialización de estado calculada
  // Usamos useCallback para que la función sea estable y pueda incluirse en las dependencias del efecto
  const getInitialState = useCallback((): HabitFormState => {
    if (habitToEdit) {
      return {
        color: habitToEdit.color,
        name: habitToEdit.name,
        targetTimeMinutes: habitToEdit.targetTimeMinutes,
        description: habitToEdit.description || "",
      };
    }
    return defaultFormData;
  }, [habitToEdit]);

  const [formData, setFormData] = useState<HabitFormState>(getInitialState);
  const [prevHabitId, setPrevHabitId] = useState(habitToEdit?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  // Sincronizar estado cuando cambia el hábito a editar o se abre el modal
  // Patrón "Derived State" para evitar useEffect
  if (isOpen && !prevIsOpen) {
    setFormData(getInitialState());
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  if (habitToEdit?.id !== prevHabitId) {
    setFormData(getInitialState());
    setPrevHabitId(habitToEdit?.id);
  }

  // === Handlers para el Formulario ===
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    // Usar parseInt o Number() solo si el campo es targetTimeMinutes
    const value =
      e.target.name === "targetTimeMinutes"
        ? Number(e.target.value)
        : e.target.value;

    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const tailwindColors = [
    "red-600",
    "rose-500",
    "pink-500",
    "orange-500",
    "amber-500",
    "yellow-500",
    "lime-600",
    "emerald-500",
    "green-600",
    "teal-500",
    "sky-400",
    "blue-600",
    "indigo-600",
    "purple-600",
    "gray-700",
  ];

  const borderColorClass = `border-${formData.color}`;
  const ringColorClass = `ring-${formData.color}`;

  const isEditing = !!habitToEdit;
  const dialogTitle = isEditing ? "✏️ Edit Habit" : "✨ Create Habit";
  const buttonText = isEditing ? "Save Changes" : "Add Habit";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={`border-4 ${borderColorClass} focus:ring-8 ${ringColorClass} focus:ring-opacity-50`}
    >
      <DialogTitle
        as="h3"
        className="text-lg font-medium leading-6 border-b pb-2 mb-4 text-gray-300"
      >
        {dialogTitle}
      </DialogTitle>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Color Selector */}
        <div>
          <label htmlFor="color" className="block text-sm font-medium mb-2">
            Color Tag
          </label>
          <div className="overflow-x-auto scrollbar-thin-custom">
            <div className="flex flex-nowrap gap-2 p-2">
              {tailwindColors.map((colorClass) => (
                <button
                  key={colorClass}
                  type="button"
                  className={`w-8 h-8 shrink-0 rounded-full shadow-md transition duration-150 flex items-center justify-center bg-${colorClass} 
                            ${
                              formData.color === colorClass
                                ? "ring-4 ring-offset-2 ring-offset-gray-900 ring-gray-400"
                                : "hover:ring-2 hover:ring-offset-2 hover:ring-offset-gray-900 ring-gray-300/50"
                            }`}
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      color: colorClass,
                    }))
                  }
                >
                  {formData.color === colorClass && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-400"
          >
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-slate-800 shadow-sm p-2 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="targetTimeMinutes"
            className="block text-sm font-medium text-gray-400"
          >
            Time/Session (min)
          </label>
          <input
            type="number"
            name="targetTimeMinutes"
            id="targetTimeMinutes"
            required
            min="5"
            value={formData.targetTimeMinutes}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-slate-800 shadow-sm p-2 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-400"
          >
            Description (Optional)
          </label>
          <textarea
            name="description"
            id="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border border-gray-700 bg-slate-800 shadow-sm p-2 text-gray-100 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="flat">
            {buttonText}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default NewHabitModal;
