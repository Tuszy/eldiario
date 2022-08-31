// Crypto
import { ethers } from "ethers";

// Types
import type { ERC725JSONSchema } from "@erc725/erc725.js";
import type { Page } from "../components/PagedList/PagedList.d";

// Helper
import { getKeysForNamesFromSchema } from "../contracts/SocialNetworkConstants";
import _ from "lodash";

export const fetchPage = async (
  contract: ethers.Contract,
  schema: ERC725JSONSchema[],
  arrayKeyName: string,
  startIndex: number,
  stopIndex: number
): Promise<null | Page<string>> => {
  if (stopIndex < startIndex || !/^[a-zA-Z0-9]+\[\]$/.test(arrayKeyName))
    return null;

  try {
    let keys = getKeysForNamesFromSchema(schema, [arrayKeyName]);
    if (keys.length === 0) return null;

    const totalItemCount = parseInt(
      await contract["getData(bytes32)"](keys[0])
    );

    const page: Page<string> = {
      totalItemCount: 0,
      itemCount: 0,
      items: {},
    };

    if (!isNaN(totalItemCount) && (startIndex < 0 || stopIndex < 0)) {
      page.totalItemCount = totalItemCount;
      return page;
    }

    if (isNaN(totalItemCount) || startIndex >= totalItemCount) return page;
    page.totalItemCount = totalItemCount;
    page.itemCount = totalItemCount - startIndex;

    const maxItemCount = stopIndex - startIndex + 1;
    if (page.itemCount > maxItemCount) page.itemCount = maxItemCount;

    const arrayNameWithoutBraces = arrayKeyName.replace("[]", "");
    const arrayIndexKeys = _.range(
      startIndex + 1, // 0 is sentinel value in custom ERC725YEnumerableSet so we need to increment the startIndex by one
      startIndex + 1 + page.itemCount
    ).map((index) => `${arrayNameWithoutBraces}[${index}]`);

    keys = getKeysForNamesFromSchema(schema, arrayIndexKeys);
    const arrayValues: string[] = await contract["getData(bytes32[])"](keys);

    for (let i = 0; i < arrayValues.length; i++) {
      const itemIndex: string = (i + startIndex + 1).toString();
      page.items[itemIndex] = "0x" + arrayValues[i].substring(26);
    }

    return page;
  } catch (e) {
    return null;
  }
};
