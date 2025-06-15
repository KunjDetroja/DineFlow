import MainLayout from "@/layouts/MainLayout";

const Tables = () => {
  return (
    <MainLayout title="Tables" buttonTitle="Add Table" buttonLink="/tables/add">
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          No tables available. Please add a table.
        </p>
      </div>
    </MainLayout>
  );
};

export default Tables;
