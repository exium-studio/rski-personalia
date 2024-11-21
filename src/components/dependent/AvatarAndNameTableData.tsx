import { Avatar, HStack, StackProps, Text, Tooltip } from "@chakra-ui/react";
import { Interface__UnitKerja } from "../../constant/interfaces";
import CContainer from "../wrapper/CContainer";
import BooleanBadge from "./BooleanBadge";
import DetailKaryawanModalDisclosure from "./DetailKaryawanModalDisclosure";
import { ReactNode } from "react";
import useAuth from "../../global/useAuth";
import isHasPermissions from "../../lib/isHasPermissions";

interface Props extends StackProps {
  detailKaryawanId?: string;
  data: {
    id: number;
    nama: string;
    fullName?: string;
    foto_profil: string | null;
    unit_kerja?: Interface__UnitKerja;
  };
  noDetail?: boolean;
  addition?: ReactNode;
}

export default function AvatarAndNameTableData({
  detailKaryawanId,
  data,
  noDetail = false,
  addition,
  ...props
}: Props) {
  const { userPermissions } = useAuth();
  const viewPermission = isHasPermissions(userPermissions, [50]);

  return (
    <HStack w={"243px"} gap={3} {...props}>
      {noDetail || !viewPermission ? (
        <Avatar
          cursor={"pointer"}
          src={data.foto_profil || ""}
          name={data.nama}
          size={data.unit_kerja ? "md" : "sm"}
        />
      ) : (
        <DetailKaryawanModalDisclosure
          detailKaryawanId={detailKaryawanId}
          user_id={data.id}
        >
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
          <Text w={"fit-content"} maxW={"100%"} className="noofline-1">
            {data.fullName || data.nama}
          </Text>
        </Tooltip>

        {(data.unit_kerja || addition) && (
          <HStack>
            {data.unit_kerja && (
              <BooleanBadge
                data={parseInt(
                  data.unit_kerja.jenis_karyawan as unknown as string
                )}
                colorScheme={
                  parseInt(data.unit_kerja.jenis_karyawan as unknown as string)
                    ? "cyan"
                    : "orange"
                }
                trueValue="Shift"
                falseValue="Non-Shift"
                w={"100px"}
              />
            )}

            {addition}
          </HStack>
        )}
      </CContainer>
    </HStack>
  );
}
