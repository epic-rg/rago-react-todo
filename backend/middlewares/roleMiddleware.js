export function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

export function isMember(req, res, next) {
  if (req.user.role !== "member") {
    return res.status(403).json({ message: "Member access required" });
  }
  next();
}
