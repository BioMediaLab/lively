import { NextFunctionComponent } from "next";
import makePage from "../lib/makePage";
import ErrorMessage from "../components/ErrorMessage";
import ClassUnitList from "../components/ClassUnitList";

interface Props {
  classId: string | null;
  unitId: string | null;
}

const Index: NextFunctionComponent<Props> = props => {
  if (!props.classId) {
    return <ErrorMessage message="Unit not found" />;
  }
  if (!props.unitId) {
    return (
      <div>
        <ClassUnitList onUnitSelect={unitId => {}} classId={props.classId} />
      </div>
    );
  }
  return <div>Here is a unit!</div>;
};

Index.getInitialProps = ctx => {
  let classId = null;
  let unitId = null;
  if (typeof ctx.query.class_id === "string") {
    classId = ctx.query.class_id;
  }
  if (typeof ctx.query.unit_id === "string") {
    unitId = ctx.query.unit_id;
  }
  return {
    classId,
    unitId
  };
};

export default makePage(Index);
