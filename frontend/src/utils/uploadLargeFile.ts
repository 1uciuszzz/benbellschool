import CryptoJS from "crypto-js";
import { http } from "./http";
import { AxiosResponse } from "axios";

interface LargeFilesInDto {
  sha256: string;
  name: string;
  size: number;
  mimeType: string;
}

interface CreateMultipartUploadRef {
  id: string;
  sha256: string;
  name: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  updatedAt: Date;
  uploadId: string | undefined;
  needToUpload: number[] | undefined;
}

interface CompleteUploadInDto {
  uploadId: string;
}

const CHUNK_SIZE = 64 * 1024 * 1024;

export async function calculateSHA256ByChunks(file: File): Promise<string> {
  let hash = CryptoJS.algo.SHA256.create();

  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();
    let offset = 0;

    fileReader.onload = function () {
      const chunkBuffer = fileReader.result as ArrayBuffer;
      const chunkWordArray = CryptoJS.lib.WordArray.create(chunkBuffer);
      hash = hash.update(chunkWordArray);

      offset += CHUNK_SIZE;
      if (offset < file.size) {
        readChunk();
      } else {
        const hashHex = hash.finalize().toString();
        resolve(hashHex);
      }
    };

    fileReader.onerror = function (event) {
      reject(event.target?.error);
    };

    function readChunk() {
      const chunk = file.slice(offset, offset + CHUNK_SIZE);
      fileReader.readAsArrayBuffer(chunk);
    }

    readChunk();
  });
}

const uploadPart = async (
  file: File,
  partNumber: number,
  largeFileId: string,
  sha256: string,
  uploadId: string
) => {
  const start = (partNumber - 1) * CHUNK_SIZE;
  const end = Math.min(start + CHUNK_SIZE, file.size);
  const chunk = file.slice(start, end);
  const req2 = new FormData();
  req2.append("largeFileId", largeFileId);
  req2.append("uploadId", uploadId);
  req2.append("filepart", chunk);
  return http.post(`/large-files/${sha256}/parts/${partNumber}`, req2);
};

export const uploadLargeFile = async (file: File, mimeType: string) => {
  const sha256 = await calculateSHA256ByChunks(file);
  const req1: LargeFilesInDto = {
    sha256,
    name: file.name,
    mimeType,
    size: file.size,
  };
  const res1: AxiosResponse<CreateMultipartUploadRef> = await http.post(
    "/large-files",
    req1
  );
  if (res1.data.uploadId) {
    if (res1.data.needToUpload?.length) {
      const uploadRes = await Promise.allSettled(
        res1.data.needToUpload.map((partNumber) => {
          return uploadPart(
            file,
            partNumber,
            res1.data.id,
            sha256,
            res1.data.uploadId!
          );
        })
      );
      const allSucceeded = uploadRes.every((res) => res.status == "fulfilled");
      if (allSucceeded) {
        const req3: CompleteUploadInDto = {
          uploadId: res1.data.uploadId!,
        };
        const res3 = await http.patch(`/large-files/${sha256}`, req3);
        return res3.data;
      } else {
        throw new Error("Some parts failed to upload, please try again.");
      }
    } else {
      const req3: CompleteUploadInDto = {
        uploadId: res1.data.uploadId!,
      };
      const res3 = await http.patch(`/large-files/${sha256}`, req3);
      return res3.data;
    }
  } else {
    return res1.data;
  }
};
