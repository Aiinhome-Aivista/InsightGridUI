import { useTheme } from "../theme";

export default function Setting_page() {
  const { theme } = useTheme();
  return (
    <div className="flex flex-col  justify-center items-center w-full h-full p-8 "
      style={{ backgroundColor: theme.surface }}>
      <h1 className="text-2xl text-gray-600 font-bold"
        style={{ color: theme.primaryText }}>Under Development</h1>
    </div>
  );
}