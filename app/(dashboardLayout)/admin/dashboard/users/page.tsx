import UsersTable from "@/components/modules/admin/userManagement/UsersTable"
import ManagementTable from "@/components/shared/tables/ManagementTable"
import { getAllUsers } from "@/utils/getAllUsers"

const Users = async() => {
  const user = await getAllUsers()

  console.log(user.data, 'use jdkfj')
  return (
    <div>
      <UsersTable users = {user?.data}/>
    </div>
  )
}

export default Users
