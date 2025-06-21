import InitialLayout from "./components/initial-layout";
import Provider from "../provider";

export default function RootLayout() {
  return (
    <Provider>
      <InitialLayout />
    </Provider>
  );
}
