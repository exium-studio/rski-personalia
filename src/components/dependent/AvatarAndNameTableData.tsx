import { Avatar, HStack, StackProps, Text, Tooltip } from "@chakra-ui/react";
import { Interface__UnitKerja } from "../../constant/interfaces";
import CContainer from "../wrapper/CContainer";
import BooleanBadge from "./BooleanBadge";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";

interface Props extends StackProps {
  data: {
    id: number;
    nama: string;
    foto_profil: string | null;
    unit_kerja?: Interface__UnitKerja;
  };
  noDetail?: boolean;
}

export default function AvatarAndNameTableData({
  data,
  noDetail = false,
  ...props
}: Props) {
  return (
    <HStack w={"243px"} gap={3} {...props}>
      {noDetail ? (
        <Avatar
          cursor={"pointer"}
          src={data.foto_profil || ""}
          name={data.nama}
          size={data.unit_kerja ? "md" : "sm"}
        />
      ) : (
        <DetailKaryawanModalDisclosure user_id={data.id}>
          <Avatar
            cursor={"pointer"}
            src={data.foto_profil || ""}
            name={data.nama}
            size={data.unit_kerja ? "md" : "sm"}
          />
        </DetailKaryawanModalDisclosure>
      )}

      <CContainer gap={2} overflow={"hidden"}>
        <Tooltip label={data.nama} placement="right" openDelay={500}>
          <Text
            w={"100%"}
            whiteSpace={"nowrap"}
            overflow={"hidden"}
            textOverflow={"ellipsis"}
          >
            {data.nama}
          </Text>
        </Tooltip>

        {data.unit_kerja && (
          <BooleanBadge
            data={data.unit_kerja.jenis_karyawan}
            colorScheme={data.unit_kerja.jenis_karyawan ? "cyan" : "orange"}
            trueValue="Shift"
            falseValue="Non-Shift"
            w={"100%"}
          />
        )}
      </CContainer>
    </HStack>
  );
}
