"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { apiFetch } from "@/lib/api-client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const router = useRouter();
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [loading, setLoading] = useState(false);

  const deactivate = async () => {
    setLoading(true);
    await apiFetch("/settings/deactivate", { method: "POST" });
    router.push("/login");
  };

  const deleteAccount = async () => {
    setLoading(true);
    await apiFetch("/settings/delete", { method: "DELETE" });
    router.push("/signup");
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">Account</h1>

      <div className="flex flex-col gap-4">
        <div className="border border-[var(--ig-border)] rounded p-4">
          <h2 className="text-sm font-semibold mb-1">Deactivate account</h2>
          <p className="text-xs text-[var(--ig-text-secondary)] mb-3">
            Temporarily hide your profile and content
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowDeactivate(true)}
          >
            Deactivate
          </Button>
        </div>

        <div className="border border-[var(--ig-error)] rounded p-4">
          <h2 className="text-sm font-semibold mb-1 text-[var(--ig-error)]">
            Delete account
          </h2>
          <p className="text-xs text-[var(--ig-text-secondary)] mb-3">
            Permanently delete your account and all data
          </p>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <Modal
        open={showDeactivate}
        onClose={() => setShowDeactivate(false)}
        title="Deactivate account?"
      >
        <p className="text-sm mb-4">
          You can reactivate anytime by logging back in.
        </p>
        <Button
          onClick={deactivate}
          loading={loading}
          variant="secondary"
          className="w-full"
        >
          Deactivate
        </Button>
      </Modal>

      <Modal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        title="Delete account?"
      >
        <p className="text-sm text-[var(--ig-error)] mb-4">
          This action is permanent and cannot be undone.
        </p>
        <Button
          onClick={deleteAccount}
          loading={loading}
          variant="danger"
          className="w-full"
        >
          Delete permanently
        </Button>
      </Modal>
    </div>
  );
}
