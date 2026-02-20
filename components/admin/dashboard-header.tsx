import prisma from "@/lib/prisma";

const DashboardHeader = async () => {
  const institute = await prisma.institute.findFirst();
  
  return (
    <div>
      <h2 className="text-2xl font-bold">
        {institute?.name ?? "Institute Name"}
      </h2>
      <p className="text-muted-foreground">
        Manage teachers, students, classes, and generate result cards.
      </p>
    </div>
  );
};

export default DashboardHeader;
