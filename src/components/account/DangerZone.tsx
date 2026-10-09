import { useContext, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/api";
import { AuthContext } from "../../context/authContext";
import { apiErrorMessage } from "../../utils/apiError";
import Modal from "./Modal";
import PasswordInput from "./PasswordInput";
import SectionCard, { secondaryButtonClass } from "./SectionCard";

const dangerButtonClass =
  "inline-flex h-11 items-center justify-center rounded-full bg-[#D92D20] px-6 text-[15px] font-medium text-white transition-colors hover:bg-[#B42318] disabled:cursor-not-allowed disabled:opacity-40";

const DangerZone = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const close = () => {
    setOpen(false);
    setPassword("");
    setError("");
  };

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setDeleting(true);
    setError("");
    try {
      await api.delete("/user/delete-account", { data: { password } });
      toast.success("Your account has been deleted");
      logout();
      navigate("/");
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't delete your account. Please try again."));
      setDeleting(false);
    }
  };

  return (
    <>
      <SectionCard
        id="delete"
        tone="danger"
        title="Delete account"
        description="Permanently remove your account and personal details. This can't be undone."
        footer={
          <button type="button" onClick={() => setOpen(true)} className={dangerButtonClass}>
            Delete account
          </button>
        }
      >
        <ul className="list-disc space-y-1.5 pl-5 text-[14px] text-[#4A4D55]">
          <li>Your profile and login will be removed straight away.</li>
          <li>Saved properties on this device will no longer be linked to an account.</li>
          <li>To use Estatery again you'll need to create a new account.</li>
        </ul>
      </SectionCard>

      {open && (
        <Modal
          title="Delete your account?"
          description="This permanently deletes your account. Enter your password to confirm."
          onClose={close}
          busy={deleting}
        >
          <form onSubmit={handleDelete} className="space-y-4">
            <PasswordInput
              label="Password"
              value={password}
              onChange={(value) => {
                setPassword(value);
                setError("");
              }}
              autoComplete="current-password"
              invalid={Boolean(error)}
            />
            {error && (
              <p role="alert" className="text-[13px] text-[#B42318]">
                {error}
              </p>
            )}
            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <button type="button" onClick={close} disabled={deleting} className={secondaryButtonClass}>
                Cancel
              </button>
              <button type="submit" disabled={!password || deleting} className={dangerButtonClass}>
                {deleting ? "Deleting…" : "Delete my account"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
};

export default DangerZone;
