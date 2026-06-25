import { useLocalSearchParams } from "expo-router";

import { ReaderScreen } from "@/features/reader/screens/ReaderScreen";

export default function ReaderRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <ReaderScreen bookId={id ?? ""} />;
}
