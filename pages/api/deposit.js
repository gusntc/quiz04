import { checkToken } from "../../backendLibs/checkToken";
import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";

export default function depositRoute(req, res) {
  if (req.method === "PUT") {
    //check authentication
    const user = checkToken(req);
    const users = readUsersDB();
    //console.log(user);
    if (!user.isAdmin) {
      const amount = req.body.amount;
      //validate body
      if (typeof amount !== "number")
        return res.status(400).json({ ok: false, message: "Invalid amount" });

      //check if amount < 1
      if (amount <= 0)
        return res
          .status(400)
          .json({ ok: false, message: "Amount must be greater than 0" });

      //find and update money in DB
      const foundUserIdx = users.findIndex((x) => x.username === user.username);
      //console.log(foundUser);
      if (foundUserIdx === -1)
        return res
          .status(404)
          .json({ ok: false, message: "user is not found" });

      users[foundUserIdx].money += req.body.amount;
      writeUsersDB(users);

      return res.json({ ok: true, money: users[foundUserIdx].money });
    } else {
      return res
        .status(403)
        .json({ ok: false, message: "You do not have permission to deposit" });
    }
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
