import { NextFunctionComponent } from "next";
import makePage from "../lib/makePage";
import ClassList from "../components/ClassList";
import { Heading } from "rebass";

const Index: NextFunctionComponent = () => (
  <div
    style={{
      backgroundImage:
        "url(https://res.cloudinary.com/teepublic/image/private/s--r4xoF8Zx--/t_Preview/b_rgb:ffffff,c_limit,f_jpg,h_630,q_90,w_630/v1484033673/production/designs/1090200_1.jpg)",
      width: "100%",
      height: "90vh"
    }}
  >
    <Heading>My Classes</Heading>
    <ClassList />
  </div>
);

export default makePage(Index);
