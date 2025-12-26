import { PlusIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import ProfileDateItem from "./ProfileDateItem";
import ProfileDateInput from "./ProfileDateInput";
import { UserService } from "@/services/user-service";
import { toast } from "react-toastify";

const userService = new UserService();

const ProfileDates = (): ReactNode => {
  const [dates, setDates] = useState(new Array<DateItemType>());
  const [askDate, setAskDate] = useState(false);

  const handleAddDateClick = (): void => {
    setAskDate(true);
  };

  const addDate = async (title: UserDateTitleType, remarks: string, date: number, month: number): Promise<void> => {
    const newDate = await userService.addUserDate(title, remarks, date, month);

    if (newDate === null) {
      toast.error("Date with this title already exists.");
    } else {
      setDates((prev) => {
        const temp = Array.from(prev);

        temp.push(newDate);

        return temp;
      });
      toast.success("Added new date successfully.");
    }
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
        <div className="absolute inset-0 flex flex-col gap-2 items-stretch">
          {dates.length === 0 ? (
            <p className="border border-gray-200 bg-gray-100 text-gray-600 text-center rounded-lg p-4 w-full">No dates added</p>
          ) : (
            <div className="border-2 border-gray-200 rounded-lg w-full h-full overflow-clip">
              <div className="w-full h-full overflow-y-auto overflow-x-auto">
                <table className="table-fixed w-full min-w-3xl">
                  <colgroup>
                    <col className="w-[20%]" />
                    <col className="w-[10%]" />
                    <col className="w-[15%]" />
                    <col className="w-[55%]" />
                  </colgroup>
                  <thead className="sticky top-0 border-b border-gray-200 bg-white">
                    <tr>
                      <th>
                        <p className="text-start px-4 py-2">Title</p>
                      </th>
                      <th>
                        <p className="text-start px-4 py-2">Date</p>
                      </th>
                      <th>
                        <p className="text-start px-4 py-2">Month</p>
                      </th>
                      <th>
                        <p className="text-start px-4 py-2">Remarks</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dates.map((item, i): ReactNode => {
                      return (
                        <ProfileDateItem
                          key={`${item.name}:${item.date}:${item.month}`}
                          idx={i}
                          dateItem={item}
                        />
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
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
