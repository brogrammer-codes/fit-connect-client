import type { NextPage, GetStaticProps } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { api } from "~/utils/api";
import Head from "next/head";
import { PlanStatus } from "types/status";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "components/ui/card";
import Link from "next/link";
import { Heading } from "components/ui/heading";

const ClientPage: NextPage<{ clientId: string }> = ({ clientId }) => {
  const { data } = api.clients.getClient.useQuery({ clientId });
  if (!data) return <div>No Client with that ID</div>;
  const { client } = data;
  const assignedPlans = data.client.planList.filter(
    (plan) => plan.status === PlanStatus.ASSIGNED,
  );
  const completedPlans = data.client.planList.filter(
    (plan) => plan.status === PlanStatus.COMPLETE,
  );

  return (
    <>
      <Head>
        <title>{client.name}</title>
      </Head>

      <span className="text-3xl font-semibold">Welcome {client.name}</span>
      <span className="text-xl">Achieve Your Fitness Goals, Your Way</span>
      <div className="flex flex-col space-y-3">
        <Heading
          title={`Upcoming plans (${assignedPlans.length})`}
          description="Workout plans that have been assigned to you to complete, click on a plan to get started!"
        />
        <div className="">
          {assignedPlans.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {assignedPlans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/client/${clientId}/plan/${plan.id}`}
                >
                  <Card className=" max-w-lg">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <CardContent>
                        <ul>
                          {plan.activityList.map((activity) => (
                            <li key={activity.id}>{activity.name}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <span> You have no upcoming plans</span>
          )}
        </div>
      </div>
      <div className="flex flex-col space-y-3">
        <Heading
          title={`Completed plans (${completedPlans.length})`}
          description="Workouts you have already completed, click on the plan to view more details."
        />
        <div className="">
          {completedPlans.length > 0 ? (
            <div className="flex flex-col space-y-1">
              {completedPlans.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/client/${clientId}/plan/${plan.id}`}
                >
                  <Card className=" max-w-lg">
                    <CardHeader>
                      <CardTitle className="text-md font-normal text-slate-600">
                        {plan.name}
                      </CardTitle>
                      <CardDescription>{plan.note}</CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <span> You have no completed plans</span>
          )}
        </div>
      </div>
    </>
  );
};
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const clientId = context.params?.clientId;
  if (typeof clientId !== "string") throw new Error("no client id");
  await ssg.clients.getClient.prefetch({ clientId });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      clientId,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
export default ClientPage;
