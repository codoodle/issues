import { createFileRoute, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/one")({
  component: One,
});

function One() {
  const router = useRouter();

  const handleBack = () => {
    router.history.back({
      ignoreBlocker: true,
    });
  };

  const handleGo = () => {
    router.history.go(-1, {
      ignoreBlocker: true,
    });
  };

  return (
    <div>
      <h1>Hello "/one"!</h1>
      <button onClick={handleBack}>Back</button>
      <button onClick={handleGo}>Go(-1)</button>
    </div>
  );
}
