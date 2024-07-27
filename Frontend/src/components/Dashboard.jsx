import BoardCard from "./BoardCard";
import EmptyCard from "./EmptyCard";

const mockData = [
  { id: 1, title: "Task 1", description: "Description for Task 1", lastUpdate: "2 Days ago" },
];

const Dashboard = () => {
  const filledData = [...mockData];
  while (filledData.length < 3) {
    filledData.push({ id: `empty-${filledData.length}`, isEmpty: true });
  }
  return (
    <div className=" text-white flex flex-col">
      {/* Board Card*/}
      <div className="grid grid-cols-1 grid-rows-3 gap-16 px-16 py-32 h-screen">
        {filledData.map((item) =>
          item.isEmpty ? (
            <EmptyCard key={item.id} />
          ) : (
            <BoardCard
              key={item.id}
              title={item.title}
              description={item.description}
              lastUpdate={item.lastUpdate}
            />
          )
        )}
      </div>
    </div>
  );
};

export default Dashboard;
