import { MONTHS } from "@/utilities/date";
import { ReactNode } from "react";

type ProfileDateItemProps = {
  dateItem: DateItemType;
};

const ProfileDateItem = ({
  dateItem
}: ProfileDateItemProps): ReactNode => {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <p
        className="text-xl font-semibold"
      >
        {dateItem.name}
      </p>
      <p
        className="text-gray-600"
      >
        {`${dateItem.date.toString().padStart(2, "0")} ${MONTHS[dateItem.month].name}`}
      </p>
    </div>
  );
};

export default ProfileDateItem;
