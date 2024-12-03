import dynamic from "next/dynamic";
import Head from "next/head";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { NextPageContext } from "next/types";
import type { AxiosInstance } from "axios";

const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface PageContext extends NextPageContext {
  axiosInstance: AxiosInstance;
}

const Home = ({ ...props }) => {
  const locale: string = props?.locale ?? "";

  return (
    <>
      <Head>
        <title>Home Page</title>
        <meta name="description" content="Home Page" />
      </Head>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
            {locale.toLocaleUpperCase()} Website Home Page
          </Typography>
          <div>
            <ReactJson
              src={props?.data ?? {}}
              theme="monokai"
              iconStyle="square"
              collapsed={false}
              enableClipboard={false}
              displayDataTypes={false}
            />
          </div>
        </Box>
      </Container>
    </>
  );
};

Home.getInitialProps = async (ctx: PageContext) => {
  const { axiosInstance } = ctx;

  try {
    const { data } = await axiosInstance.get("/api/config/api/country/list");
    return { data };
  } catch (error: any) {
    console.info(error);
    return { data: {} };
  }
};

export default Home;
