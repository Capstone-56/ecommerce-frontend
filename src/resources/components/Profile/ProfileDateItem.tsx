import { MONTHS } from "@/utilities/date";
import { ReactNode } from "react";

type ProfileDateItemProps = {
  dateItem: DateItemType;
  idx: number;
};

const TITLE_MAP = {
  "birthday": "Birthday",
  "anniversary": "Anniversary",
  "other": "Other"
};

const ProfileDateItem = ({
  dateItem,
  idx
}: ProfileDateItemProps): ReactNode => {
  return (
    <tr className={`${idx % 2 === 0 ? "bg-whit" : "bg-gray-50"} hover:bg-gray-200 transition-colors`}>
      <td>
        <p className="px-4 py-2">{TITLE_MAP[dateItem.name]}</p>
      </td>
      <td>
        <p className="px-4 py-2">{dateItem.date.toString().padStart(2, "0")}</p>
      </td>
      <td>
        <p className="px-4 py-2">{MONTHS[dateItem.month].name}</p>
      </td>
      <td>
        <p className="px-4 py-2">{dateItem.remarks}</p>
      </td>
    </tr>
  );
};

export default ProfileDateItem;
