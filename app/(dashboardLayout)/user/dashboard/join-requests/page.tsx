import ManagementTable from "@/components/shared/tables/ManagementTable"
import { getMyPlanRequests } from "@/services/travelPlan/travelPlanRequest"

const JoinRequests = async() => {
    const requests = await getMyPlanRequests();

    console.log(requests, 'req')
    return (
        <div>
            {/* <ManagementTable
                data={users}
                columns={usersColumns}
                emptyMessage="No users found"
                getRowKey={(user) => user?.id}
            /> */}
        </div>
    )
}

export default JoinRequests
