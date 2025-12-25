import { PlusIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import ProfileDateItem from "./ProfileDateItem";
import ProfileDateInput from "./ProfileDateInput";
import { UserService } from "@/services/user-service";

const userService = new UserService();

const ProfileDates = (): ReactNode => {
  const [dates, setDates] = useState(new Array<DateItemType>());
  const [askDate, setAskDate] = useState(false);

  const handleAddDateClick = (): void => {
    setAskDate(true);
  };

  const addDate = (title: string, date: number, month: number): void => {
    setDates((prev) => {
      const temp = Array.from(prev);

      temp.push({
        id: window.crypto.randomUUID(),
        name: title,
        date,
        month
      });

      return temp;
    });
  };

  const init = async (): Promise<void> => {
    setDates(await userService.getUserDates());
  }

  useEffect((): void => {
    init();
  }, [])

  return (
    <div className="absolute inset-0 flex flex-col gap-2 items-stretch">
      <p className="font-semibold md:text-4xl text-2xl">Dates</p>
      <div className="grow relative">
        <div className="absolute inset-0 flex flex-col gap-2 items-stretch overflow-y-auto">
          {dates.length === 0 ? (
            <p className="border border-gray-200 bg-gray-100 text-gray-600 text-center rounded-lg p-4 w-full">No dates added</p>
          ) : dates.map((item): ReactNode => {
            return (
              <ProfileDateItem
                key={`${item.name}:${item.date}:${item.month}`}
                dateItem={item}
              />
            );
          })}
        </div>
      </div>
      <div className="flex items-center justify-end">
        <button
          className="cursor-pointer text-white bg-sky-500 hover:bg-sky-600 active:bg-sky-700 transition-colors rounded-lg p-2"
          onClick={handleAddDateClick}
        >
          <PlusIcon className="size-6" />
        </button>
      </div>
      {askDate && (
        <ProfileDateInput
          setAskDate={setAskDate}
          addDate={addDate}
        />
      )}
    </div>
  );
};

export default ProfileDates;
