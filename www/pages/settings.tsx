import React, { useState } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import gql from "graphql-tag";
import Link from "next/link";

import makePage from "../lib/makePage";
import AreYouSure from "../components/ui/AreYouSure";

const Settings = () => {
  const [showConf, setShowConf] = useState(false);
  const { data, error, loading } = useQuery(gql`
    query amIAdmin {
      me {
        id
        siteAdmin
      }
    }
  `);
  const endAdmin = useMutation(gql`
    mutation endAdminMute {
      updateAdmin(setAdmin: false) {
        id
        siteAdmin
      }
    }
  `);

  let adminPart;
  if (loading || error || !data) {
    adminPart = <span />;
  } else {
    adminPart = (
      <div>
        <button onClick={() => setShowConf(true)}>Resign as admin</button>
        <AreYouSure
          showing={showConf}
          bodyText="Do you want to remove your site admin privileges?"
          onSelect={r => {
            if (r) {
              endAdmin();
            }
            setShowConf(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      Settings...
      {adminPart}
      <Link href="/">
        <a>Return</a>
      </Link>
    </div>
  );
};

export default makePage(Settings);
