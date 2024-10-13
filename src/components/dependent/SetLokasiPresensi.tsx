import { Button, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { RiFocus3Line } from "@remixicon/react";
import { Dispatch, useRef, useState } from "react";
import { LatLng } from "../../constant/interfaces";
import { responsiveSpacing } from "../../constant/sizes";
import getLocation from "../../lib/getLocation";
import SearchComponent from "./input/SearchComponent";
import SetLokasiPresensiLeafletMap from "./SetLokasiPresensiLeafletMap";

// Props untuk komponen GMaps
interface Props {
  center: LatLng;
  officeCenter: LatLng | undefined;
  presence_radius: number | undefined;
  setOfficeLoc: (input: any) => void;
  setCenter: Dispatch<LatLng>;
}

export default function SetLokasiPresensi({
  center,
  officeCenter,
  presence_radius,
  setOfficeLoc,
  setCenter,
}: Props) {
  const [searchAddress, setSearchAddress] = useState<string>("");
  const searchComponentRef = useRef<HTMLDivElement>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [loading, setLoading] = useState<boolean>(false);
  function setLokasiSaatIni() {
    setLoading(true);
    getLocation()
      .then(({ lat, long }) => {
        // setOfficeLoc({ lat: lat, lng: long });
        setCenter({ lat: lat, lng: long });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <HStack mb={responsiveSpacing}>
        <SearchComponent
          inputRef={searchComponentRef}
          name="Search"
          onChangeSetter={(input) => {
            setSearchAddress(input);
          }}
          inputValue={searchAddress}
          placeholder="cari alamat"
          onFocus={onOpen}
          onBlur={onClose}
        />
        <Button
          flexShrink={0}
          className="btn-solid clicky"
          onClick={setLokasiSaatIni}
          isLoading={loading}
          leftIcon={<Icon as={RiFocus3Line} />}
        >
          Lokasi Saat Ini
        </Button>
      </HStack>

      <SetLokasiPresensiLeafletMap
        center={center}
        officeCenter={officeCenter}
        setOfficeLoc={setOfficeLoc}
        presence_radius={presence_radius}
        zoom={17}
        searchAddress={searchAddress}
        searchComponentRef={searchComponentRef}
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
      />
    </>
  );
}
