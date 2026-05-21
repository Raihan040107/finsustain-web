import type { User } from "../../types";

type UsersPageProps = {
  users: User[];
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = ["#e07b54", "#5DCAA5", "#378ADD", "#D4537E", "#7F77DD"];

export default function UsersPage({ users }: UsersPageProps) {
  if (users.length === 0) {
    return (
      <div className="page-content">
        <div className="card">
          <div className="empty-state">
            <i className="ti ti-users-off" aria-hidden="true" />
            <p>Belum ada pengguna terdaftar.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Daftar pengguna</h3>
          <span className="badge">{users.length} user</span>
        </div>
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th>Bergabung</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <span className="avatar" style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}>
                        {getInitials(user.name)}
                      </span>
                      {user.name}
                    </div>
                  </td>
                  <td className="text-muted">{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.id_role === 2 ? "role-admin" : "role-user"}`}>{user.id_role === 2 ? "Admin" : "User"}</span>
                  </td>
                  <td className="text-muted">
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
