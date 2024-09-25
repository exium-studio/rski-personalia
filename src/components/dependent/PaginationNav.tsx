import { HStack, Icon, IconButton } from "@chakra-ui/react";
import { RiArrowLeftSLine, RiArrowRightSLine } from "@remixicon/react";
import { iconSize } from "../../constant/sizes";
import PaginationJump from "./PaginationJump";

type Props = {
  page: number;
  setPage: (page: number) => void;
  paginationData?: any;
};

export default function PaginationNav({
  page,
  setPage,
  paginationData,
}: Props) {
  return (
    <HStack justify={"center"}>
      <IconButton
        aria-label="prev"
        icon={<Icon as={RiArrowLeftSLine} fontSize={iconSize} />}
        variant={"ghost"}
        className="btn"
        size={"sm"}
        onClick={() => {
          if (page > 1) {
            setPage(page - 1);
          }
        }}
        isDisabled={page === 1 && !paginationData?.links?.prev}
      />

      <PaginationJump
        page={page}
        setPage={setPage}
        pagination={paginationData}
      />

      <IconButton
        aria-label="prev"
        icon={<Icon as={RiArrowRightSLine} fontSize={iconSize} />}
        variant={"ghost"}
        className="btn"
        size={"sm"}
        onClick={() => {
          setPage(page + 1);
        }}
        isDisabled={
          page === paginationData?.meta?.last_page &&
          !paginationData?.links?.next
        }
      />
    </HStack>
  );
}
