export default async function Page({params}: { params: any }) {
  const {id} = await params;


  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-full max-w-3xl">
        History of chat with ID: {id}
      </div>
    </div>
  );
}