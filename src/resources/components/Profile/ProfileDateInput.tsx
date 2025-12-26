import { MONTHS } from "@/utilities/date";
import { XIcon } from "lucide-react";
import { ReactNode, useState } from "react";

type ProfileDateInputProps = {
  setAskDate: React.Dispatch<React.SetStateAction<boolean>>;
  addDate: (title: UserDateTitleType, remarsk: string, date: number, month: number) => void;
};

const ProfileDateInput = ({
  setAskDate,
  addDate
}: ProfileDateInputProps): ReactNode => {
  const [formTitle, setFormTitle] = useState<UserDateTitleType>("birthday");
  const [formRemarks, setFormRemarks] = useState("");
  const [formDate, setFormDate] = useState<number>(1);
  const [formMonth, setFormMonth] = useState<number>(0);

  const closeModal = (): void => {
    setAskDate(false);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = e.currentTarget.value as UserDateTitleType;

    setFormTitle(value);

    if (value !== "other") {
      setFormRemarks("");
    }
  };

  const handleSubmit = (): void => {
    addDate(formTitle, formRemarks, formDate, formMonth);
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 bg-black/10 flex items-center justify-center z-10"
      onClick={closeModal}
    >
      <form
        className="border border-gray-200 shadow-md bg-white rounded-lg flex flex-col gap-2 p-4 w-full max-w-96"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        action="javascript:"
      >
        <div className="flex items-center justify-between">
          <p className="text-xl font-semibold">Add New Date</p>
          <button
            type="reset"
            className="cursor-pointer text-red-500 bg-white hover:bg-red-100 active:bg-red-200 transition-colors rounded-lg p-1"
            onClick={closeModal}
          >
            <XIcon className="size-6" />
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <p>Title</p>
          <select
            className="border-2 border-gray-200 rounded-lg outline-none bg-white hover:bg-gray-100 ring-2 ring-white focus:ring-gray-200 transition-all p-2"
            value={formTitle}
            onChange={handleTitleChange}
            required
          >
            <option value="birthday">
              Birthday
            </option>
            <option value="anniversary">
              Anniversary
            </option>
            <option value="other">
              Other
            </option>
          </select>
        </div>
        {formTitle === "other" && (
          <div className="flex flex-col gap-1">
            <p>Remarks</p>
            <input
              className="border-2 border-gray-200 rounded-lg outline-none bg-white hover:bg-gray-100 ring-2 ring-white focus:ring-gray-200 transition-all p-2"
              value={formRemarks}
              onChange={e => setFormRemarks(e.currentTarget.value)}
              type="text"
              required
            />
          </div>
        )}
        <div className="flex items-stretch gap-2">
          <div className="basis-full flex flex-col gap-1">
            <p>Date</p>
            <input
              className="border-2 border-gray-200 rounded-lg outline-none bg-white hover:bg-gray-100 ring-2 ring-white focus:ring-gray-200 transition-all p-2"
              type="number"
              value={formDate}
              min={1}
              max={MONTHS.at(formMonth)?.maxDate}
              onChange={e => setFormDate(parseInt(e.target.value))}
              required
            />
          </div>
          <div className="basis-full flex flex-col gap-1">
            <p>Month</p>
            <select
              className="border-2 border-gray-200 rounded-lg outline-none bg-white hover:bg-gray-100 ring-2 ring-white focus:ring-gray-200 transition-all p-2"
              value={formMonth}
              onChange={e => setFormMonth(parseInt(e.target.value))}
              required
            >
              {MONTHS.map((month, i): ReactNode => {
                return (
                  <option value={i}>{month.name}</option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <button type="submit" className="cursor-pointer text-white bg-green-500 hover:bg-green-600 active:bg-green-700 rounded-lg transition-colors px-4 py-2">
            Add
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDateInput;
