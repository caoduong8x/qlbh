import React, { useEffect, useRef, useState } from 'react';
import { embedDashboard } from '@superset-ui/embedded-sdk';
import axios from 'axios';
import styled from 'styled-components';
import { Grid } from '@mui/material';
import MDTypography from 'components/MDTypography/index';

import { BASE_SUPERSET } from "services/constants";
import webStorageClient from 'config/webStorageClient';
import MDButton from 'components/MDButton/index';
import { XoaChart } from './XoaChart';

const Main = styled.div`
  iframe {
    width: 100vw;
    @media (min-width: 768px) {
        width: 92vw;
    }
    min-height: 80vw;
    max-height: max-content;
    border: none;
    transform: scale(0.8);
    transform-origin: 0 0;
    overflow: hidden;
  }
`;

export const Chart = ({ title, idChart, infoChart, setReload, reload }) => {
  const [dataToken, setDataToken] = useState("");
  const tokenLoginSuperSet = webStorageClient.getTokenSuperSet();
  const [openDelete, setOpenDelete] = useState(false);
  const [reloadDelete, setReloadDelete] = useState(false);

  const iframeRef = useRef(null);

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
          }
        },
        iframeSandboxExtras: ['allow-top-navigation', 'allow-popups-to-escape-sandbox']
      });
    }
  }, [dataToken, idChart]);

  useEffect(() => {
    const url = `${BASE_SUPERSET}/api/v1/security/guest_token/`;

    if (tokenLoginSuperSet) {
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

      axios.post(url, dataSubmit, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenLoginSuperSet}`,
        },
      })
        .then((response) => {
          const data = response.data;
          setDataToken(data.token);
        })
        .catch((error) => {
          console.error("Error fetching guest token:", error);
        });
    }
  }, [idChart]);

  useEffect(() => {
    setReload(!reload);
  }, [reloadDelete]);

  return (
  <Grid container style={{ marginTop: "-20px" }}>
    <XoaChart 
      open={openDelete}
      setOpen={setOpenDelete}
      infoChart={infoChart}
      setReloadDelete={setReloadDelete}
      reloadDelete={reloadDelete} 
    />
    {
      idChart ? (
        <>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <MDTypography variant="h5" fontWeight="medium" mb={2}>
                {title}
              </MDTypography>
            </Grid>
            {/* <Grid item>
              <MDButton
                variant="outlined"
                color="info"
                size="small"
                onClick={() => { setOpenDelete(true); }}
              >
                Xóa
              </MDButton>
            </Grid> */}
          </Grid>
          <Grid item xs={12}>
            <Main
              ref={iframeRef}
              id={idChart}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                overflow: 'hidden',
              }}
            />
          </Grid>
        </>
      ) : (
        <MDTypography variant="h5" fontWeight="medium" mb={2}>
          {title}
          <br />
          <MDTypography variant="h6" fontWeight="medium" mt={2}>
            Chưa có thống kê!
          </MDTypography>
        </MDTypography>
      )
    }
  </Grid>
);
};
