import Link from 'next/link'
import { Briefcase, ArrowRight, Plus, Calendar, LogIn } from 'lucide-react'
import { PostCard } from '@/components/home/post-card'
import { createClient } from '@/lib/supabase/server'
import { buscarPostsFeed } from '@/lib/posts-data'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Feed é o mesmo pra todo mundo — RLS já filtra sozinho: deslogado só
  // vê posts com visibilidade "publico", logado vê público + logado
  // (decisão de 18/08, revisa a versão anterior que escondia o feed
  // inteiro de quem não tinha conta)
  const posts = await buscarPostsFeed()

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-primary-500 text-lg font-bold">
          Lumiar/São Pedro da Serra
        </h1>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link
                href="/agenda"
                aria-label="Agenda"
                className="border-border text-neutral-text hover:bg-muted active:scale-95 flex size-8 items-center justify-center rounded-full border transition-all duration-150 ease-standard"
              >
                <Calendar className="size-4" />
              </Link>
              <Link
                href="/postar"
                aria-label="Publicar post"
                className="bg-primary text-primary-foreground active:scale-95 flex size-8 items-center justify-center rounded-full transition-all duration-150 ease-standard"
              >
                <Plus className="size-4" />
              </Link>
            </>
          ) : (
            <Link
              href="/login"
              aria-label="Entrar"
              className="border-border text-neutral-text hover:bg-muted active:scale-95 flex size-8 items-center justify-center rounded-full border transition-all duration-150 ease-standard"
            >
              <LogIn className="size-4" />
            </Link>
          )}
        </div>
      </div>

      {!user && (
        <a
          href="/cadastro"
          className="border-border/70 bg-card shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] active:scale-[0.99] flex items-center gap-3 rounded-lg border p-3 transition-all duration-200 ease-decelerate"
        >
          <Briefcase className="text-primary-500 size-5 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-card-foreground text-sm font-medium">Ainda não tem conta?</p>
            <p className="text-muted-foreground text-xs">
              Crie a sua pra postar, comentar e ver tudo da comunidade
            </p>
          </div>
          <ArrowRight className="text-primary-500 size-4 shrink-0" />
        </a>
      )}

      {posts.length === 0 ? (
        <div className="border-border/70 bg-card shadow-[var(--shadow-card)] flex flex-col items-center gap-2 rounded-lg border p-6 text-center">
          <p className="text-card-foreground text-sm font-medium">
            Nenhum post ainda
          </p>
          <p className="text-muted-foreground text-xs">
            Evento, curso, anúncio ou pet perdido — seja o primeiro a
            publicar.
          </p>
          {user && (
            <Link
              href="/postar"
              className="text-primary-500 mt-1 inline-flex items-center gap-1 text-xs font-semibold"
            >
              Publicar <ArrowRight className="size-3" />
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </main>
  )
}
