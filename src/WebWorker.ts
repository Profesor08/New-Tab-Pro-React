export default function WebWorker(worker: () => void) {
  const code = worker.toString();
  const blob = new Blob(["(" + code + ")()"]);
  return new Worker(URL.createObjectURL(blob));
}
