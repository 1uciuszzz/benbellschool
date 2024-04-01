import { Gender, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const Permission = {
  NONE: "NONE",
  FILE_UPLOAD: "FILE_UPLOAD",
  FILE_DOWNLOAD: "FILE_DOWNLOAD",
  LARGEFILE_UPLOAD: "LARGEFILE_UPLOAD",
  LARGEFILE_DOWNLOAD: "LARGEFILE_DOWNLOAD",
  CREATE_ROLE: "CREATE_ROLE",
  DELETE_ROLE: "DELETE_ROLE",
  UPDATE_ROLE: "UPDATE_ROLE",
  QUERY_ROLE: "QUERY_ROLE",
};

const PERMISSIONS = [
  {
    name: Permission.LARGEFILE_UPLOAD,
    description: "大文件上传",
  },
  {
    name: Permission.LARGEFILE_DOWNLOAD,
    description: "大文件下载",
  },
  {
    name: Permission.FILE_UPLOAD,
    description: "文件上传",
  },
  {
    name: Permission.FILE_DOWNLOAD,
    description: "文件下载",
  },
  {
    name: Permission.CREATE_ROLE,
    description: "创建角色",
  },
  {
    name: Permission.DELETE_ROLE,
    description: "删除角色",
  },
  {
    name: Permission.UPDATE_ROLE,
    description: "更新角色",
  },
  {
    name: Permission.QUERY_ROLE,
    description: "查询角色",
  },
];

const main = async () => {
  const prisma = new PrismaClient();
  await prisma.file.deleteMany();
  await prisma.largeFileChunk.deleteMany();
  await prisma.largeFile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.role.deleteMany();
  await prisma.permission.deleteMany();

  const permissions = await Promise.all(
    PERMISSIONS.map(async (permission) => {
      return await prisma.permission.create({
        data: {
          name: permission.name,
          description: permission.description,
        },
      });
    }),
  );

  const role = await prisma.role.create({
    data: {
      name: "系统管理员",
      description: "系统管理员",
      active: true,
    },
  });

  await Promise.all(
    permissions.map(async (permission) => {
      return await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }),
  );

  const salt = bcrypt.genSaltSync();
  const password = await bcrypt.hash("admin", salt);
  await prisma.user.create({
    data: {
      username: "admin",
      password,
      email: "",
      gender: Gender.OTHER,
      icNumber: "",
      name: "系统管理员",
      phone: "",
      active: true,
      roleId: role.id,
    },
  });
};

main();
