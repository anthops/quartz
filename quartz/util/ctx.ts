import { QuartzConfig } from "../cfg"
import { QuartzPluginData } from "../plugins/vfile"
import { FileTrieNode } from "./fileTrie"
import { FilePath, FullSlug } from "./path"

export interface Argv {
  directory: string
  verbose: boolean
  output: string
  serve: boolean
  watch: boolean
  port: number
  wsPort: number
  remoteDevHost?: string
  concurrency?: number
}

export type BuildTimeTrieData = QuartzPluginData & {
  slug: string
  urlOverride?: string
  title: string
  filePath: string
}

export interface BuildCtx {
  buildId: string
  argv: Argv
  cfg: QuartzConfig
  allSlugs: FullSlug[]
  allFiles: FilePath[]
  trie?: FileTrieNode<BuildTimeTrieData>
  urlOverrides: Map<FullSlug, FullSlug>
  incremental: boolean
}

export function trieFromAllFiles(
  allFiles: QuartzPluginData[],
  urlOverrides: Map<FullSlug, FullSlug>
): FileTrieNode<BuildTimeTrieData> {
  const trie = new FileTrieNode<BuildTimeTrieData>([])
  allFiles.forEach((file) => {
    if (file.frontmatter) {
      trie.add({
        ...file,
        slug: file.slug!,
        urlOverride: urlOverrides.get(file.slug!),
        title: file.frontmatter.title,
        filePath: file.filePath!,
      })
    }
  })

  return trie
}

export type WorkerSerializableBuildCtx = Omit<BuildCtx, "cfg" | "trie">
