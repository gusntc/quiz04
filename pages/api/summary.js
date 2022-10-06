import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    const users = readUsersDB();
    const AdminCount = users.filter((x) => x.isAdmin === user.isAdmin);
    const UserCount = users.filter((x) => x.isAdmin === false);
    var total = 0;
    const totalMoney = UserCount.map((x) => {
      total += x.money;
    });
    if (user.isAdmin) {
      return res.status(200).json({
        ok: true,
        userCount: users.length,
        adminCount: AdminCount.length,
        totalMoney: total,
      });
    } else {
      return res.status(403).json({ ok: false, message: "Permission denied" });
    }

    //compute DB summary
    //return response
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
