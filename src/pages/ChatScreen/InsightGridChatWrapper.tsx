import { useNavigate } from "react-router-dom";
import InsightGridChat from "./InsightGridChat";

export default function InsightGridChatWrapper() {
  const navigate = useNavigate();

  // Navigate back to the previous page when the chat is closed
  const handleClose = () => navigate(-1);

  return <InsightGridChat onClose={handleClose} />;
}