// Aggregate evidence only. Never writes source rows, names, contacts or access keys.
import fs from 'node:fs';
import { sourceIdentity } from '../src/lib/marketplace/source-identity.ts';
const rows=JSON.parse(fs.readFileSync('src/data/harvested-offers.json','utf8'));
const grouped=new Map();let invalid=0;
for(const row of rows){const id=sourceIdentity(row.sourceUrl);if(!id){invalid++;continue}grouped.set(id,(grouped.get(id)||0)+1)}
console.log(JSON.stringify({unit:'source listing, not person',archivedRows:rows.length,validDistinctSourceIds:grouped.size,invalidSourceUrls:invalid,repeatedSourceIds:[...grouped.values()].filter(n=>n>1).length,ambiguousLegacyAliases:'refused; not redirected to a different listing',publicApprovedRows:JSON.parse(fs.readFileSync('src/data/approved-public-offers.json','utf8')).length},null,2));
