import { SimpleGrid } from "@chakra-ui/react";
import { useFormik } from "formik";
import * as yup from "yup";
import FileInputLarge from "../../components/dependent/input/FileInputLarge";
import CContainer from "../../components/wrapper/CContainer";
import { useLightDarkColor } from "../../constant/colors";
import { responsiveSpacing } from "../../constant/sizes";
import useDataState from "../../hooks/useDataState";

export default function PengaturanMateri() {
  // SX
  const lightDarkColor = useLightDarkColor();

  // States
  const { error, loading, data, retry } = useDataState<any>({
    initialData: undefined,
    url: `/api/rski/dashboard/pengaturan/materi-pelatihan`,
    dependencies: [],
  });

  const formik = useFormik({
    validateOnChange: false,
    initialValues: {
      dokumen_1: "",
      dokumen_2: "",
      dokumen_3: "",
    },
    validationSchema: yup.object().shape({}),
    onSubmit: (values, { resetForm }) => {
      console.log(values);
    },
  });

  return (
    <CContainer
      py={responsiveSpacing}
      px={responsiveSpacing}
      h={"100%"}
      overflowY={"auto"}
      className="scrollY"
      bg={lightDarkColor}
      borderRadius={12}
      flex={"1 1 600px"}
    >
      <SimpleGrid columns={[1, 2, null, null, 3]} gap={responsiveSpacing}>
        <FileInputLarge
          name="dokumen_1"
          onChangeSetter={(input) => {
            formik.setFieldValue("dokumen_1", input);
          }}
          inputValue={formik.values.dokumen_1}
        />

        <FileInputLarge
          name="dokumen_2"
          onChangeSetter={(input) => {
            formik.setFieldValue("dokumen_2", input);
          }}
          inputValue={formik.values.dokumen_2}
        />

        <FileInputLarge
          name="dokumen_3"
          onChangeSetter={(input) => {
            formik.setFieldValue("dokumen_3", input);
          }}
          inputValue={formik.values.dokumen_3}
        />
      </SimpleGrid>
    </CContainer>
  );
}
