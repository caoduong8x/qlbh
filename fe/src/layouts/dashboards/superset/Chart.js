import React, { useEffect, useRef, useState } from "react";
import { embedDashboard } from "@superset-ui/embedded-sdk";
import axios from "axios";
import styled from "styled-components";
import MDBox from "components/MDBox/index";
import { Grid, Typography } from "@mui/material";
import MDTypography from "components/MDTypography/index";
import { BASE_SUPERSET, SUPERSET_PASSWORD_ADMIN } from "services/constants";

const Main = styled.div`
  iframe {
    width: 100vw;
    height: 1000px;
    border: none;
    transform: scale(0.8);
    transform-origin: 0 0;
    overflow: hidden;
  }
`;
const postRequest = async (url, data) => {
  try {
    const response = await axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error("Error in postRequest:", error);
    throw error;
  }
};

export const Chart = ({ title, idChart }) => {
  const [tokenLogin, setTokenLogin] = useState("");
  const [dataToken, setDataToken] = useState("");

  useEffect(() => {
    if (dataToken) {
      embedDashboard({
        id: idChart,
        supersetDomain: BASE_SUPERSET,
        mountPoint: document.getElementById(idChart),
        fetchGuestToken: () => dataToken,
        dashboardUiConfig: {
          hideTitle: true,
          filters: {
            expanded: true,
          },
        },
        iframeSandboxExtras: [
          "allow-top-navigation",
          "allow-popups-to-escape-sandbox",
        ],
      });
    }
  }, [dataToken, idChart]);

  useEffect(() => {
    const urlLogin = `${BASE_SUPERSET}/api/v1/security/login`;
    const dataSubmitLogin = {
      username: "admin",
      password: SUPERSET_PASSWORD_ADMIN,
      provider: "db",
      refresh: true,
    };

    postRequest(urlLogin, dataSubmitLogin)
      .then((data) => {
        setTokenLogin(data?.access_token);
      })
      .catch((error) => {
        console.error("Login failed:", error);
      });
  }, [idChart]);

  useEffect(() => {
    const url = `${BASE_SUPERSET}/api/v1/security/guest_token/`;

    if (tokenLogin?.length > 0) {
      const dataSubmit = {
        resources: [
          {
            id: idChart,
            type: "dashboard",
          },
        ],
        rls: [
          {
            clause: "1=1",
            dataset: 1,
          },
        ],
        user: { username: "guest" },
      };

      axios
        .post(url, dataSubmit, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenLogin}`,
          },
        })
        .then((response) => {
          const data = response.data;
          setDataToken(data.token);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [tokenLogin, idChart]);

  const iframeRef = useRef(null);

  const adjustIframeHeight = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const iframeDocument =
        iframe.contentDocument || iframe.contentWindow.document;
      if (iframeDocument) {
        iframe.style.height = iframeDocument.body.scrollHeight + "px";
      }
    }
  };


  useEffect(() => {
    const iframe = iframeRef.current;
    // Khi iframe tải xong, tính chiều cao
    if (iframe) {
      iframe.onload = adjustIframeHeight;
    }
  }, []);

  return (
    <Grid xs={12} container>
      <MDTypography variant="h4" fontWeight="medium" m={2}>
        {title}
      </MDTypography>
      <Main
        ref={iframeRef}
        id={idChart}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          // borderColor:'red',
          overflow: "hidden",
          // boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
        }}
      />
    </Grid>
  );
};
