'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowLeft, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/shared/page-header'
import { PhotoCropField } from '@/components/cadastro-negocio/photo-crop-field'
import { AddressAutocomplete } from '@/components/cadastro-negocio/address-autocomplete'
import { MapEmbed } from '@/components/shared/map-embed'
import { capitalizeWords, formatarTelefone } from '@/lib/utils'
import {
  getPasswordStrength,
  PASSWORD_STRENGTH_LABEL,
} from '@/lib/password-strength'
import { calcularIdade, IDADE_MINIMA } from '@/lib/validations/auth'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Onboarding em etapas (decisão de 18/08) — uma seção de cada vez, em
// vez de um formulário longo só. Cada etapa valida antes de deixar
// avançar; erro que vem do servidor no submit final volta pra etapa
// certa (FIELD_PARA_ETAPA), senão a mensagem apareceria escondida numa
// etapa que não é mais a visível.
const ETAPAS = ['nome', 'identificacao', 'contato', 'senha', 'foto'] as const
type Etapa = (typeof ETAPAS)[number]

const FIELD_PARA_ETAPA: Record<string, Etapa> = {
  dataNascimento: 'nome',
  username: 'identificacao',
  email: 'identificacao',
  telefone: 'contato',
  endereco: 'contato',
}

// Cadastro de CONTA só — cadastro de negócio é uma etapa separada
// (/cadastro-negocio), não amarrada aqui. Conta serve pra qualquer
// morador, não só pra quem tem negócio.
export default function CadastroPage() {
  const [etapaIndex, setEtapaIndex] = useState(0)
  const etapa: Etapa = ETAPAS[etapaIndex]

  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    username: '',
    email: '',
    telefone: '',
    endereco: '',
    dataNascimento: '',
    senha: '',
    confirmaSenha: '',
  })
  const [enderecoCoords, setEnderecoCoords] = useState<{ lat: number; lng: number } | null>(
    null
  )
  const [termos, setTermos] = useState(false)
  const [accountError, setAccountError] = useState<string | null>(null)
  const [accountErrorField, setAccountErrorField] = useState<string | null>(
    null
  )
  const [foto, setFoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [contaCriada, setContaCriada] = useState(false)
  const [emailConfirmado, setEmailConfirmado] = useState(true)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Capitaliza só ao sair do campo, não a cada tecla — em campo controlado,
  // capitalizar durante a digitação jogava o cursor pro fim do texto e
  // desfazia maiúscula intencional no meio do nome (ex: "McDonald")
  const handleNomeBlur = (campo: 'nome' | 'sobrenome') => {
    setFormData((prev) => ({ ...prev, [campo]: capitalizeWords(prev[campo]) }))
  }

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setFormData((prev) => ({ ...prev, telefone: formatarTelefone(value) }))
  }

  // Valida a etapa atual antes de deixar avançar — validação completa de
  // verdade (formato de usuário, email, endereço dentro da área etc)
  // continua sendo feita pelo Zod no servidor; isso aqui só evita avançar
  // com campo obrigatório vazio
  const validarEtapaAtual = (): boolean => {
    setAccountError(null)
    setAccountErrorField(null)

    if (etapa === 'nome') {
      if (!formData.nome.trim() || !formData.sobrenome.trim()) {
        setAccountError('Nome e sobrenome são obrigatórios')
        return false
      }
      if (!formData.dataNascimento) {
        setAccountError('Data de nascimento é obrigatória')
        setAccountErrorField('dataNascimento')
        return false
      }
      if (new Date(formData.dataNascimento) > new Date()) {
        setAccountError('Data de nascimento não pode ser no futuro')
        setAccountErrorField('dataNascimento')
        return false
      }
      if (calcularIdade(new Date(formData.dataNascimento)) < IDADE_MINIMA) {
        setAccountError(`Precisa ter pelo menos ${IDADE_MINIMA} anos pra se cadastrar`)
        setAccountErrorField('dataNascimento')
        return false
      }
    }

    if (etapa === 'identificacao') {
      if (!formData.username.trim() || !formData.email.trim()) {
        setAccountError('Usuário e email são obrigatórios')
        return false
      }
      if (!EMAIL_REGEX.test(formData.email.trim())) {
        setAccountError('Digite um email num formato válido (ex: nome@exemplo.com)')
        setAccountErrorField('email')
        return false
      }
    }

    if (etapa === 'contato') {
      if (!formData.telefone.trim()) {
        setAccountError('Telefone é obrigatório')
        return false
      }
      if (!enderecoCoords) {
        setAccountError('Escolha o endereço numa sugestão da lista, pra confirmar a região')
        setAccountErrorField('endereco')
        return false
      }
    }

    if (etapa === 'senha') {
      if (formData.senha.length < 6) {
        setAccountError('Senha precisa ter no mínimo 6 caracteres')
        return false
      }
      if (formData.senha !== formData.confirmaSenha) {
        setAccountError('As senhas não combinam')
        return false
      }
    }

    return true
  }

  const avancar = () => {
    if (!validarEtapaAtual()) return
    setEtapaIndex((i) => Math.min(i + 1, ETAPAS.length - 1))
  }

  const voltar = () => {
    setAccountError(null)
    setAccountErrorField(null)
    setEtapaIndex((i) => Math.max(i - 1, 0))
  }

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termos) {
      alert('Precisa aceitar os termos pra continuar')
      return
    }
    if (!enderecoCoords) return

    setAccountError(null)
    setAccountErrorField(null)
    setSubmitting(true)
    try {
      const res = await fetch('/api/auth/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: `${formData.nome} ${formData.sobrenome}`.trim(),
          username: formData.username,
          email: formData.email,
          telefone: formData.telefone,
          endereco: formData.endereco,
          enderecoLat: enderecoCoords.lat,
          enderecoLng: enderecoCoords.lng,
          dataNascimento: formData.dataNascimento,
          senha: formData.senha,
          confirmaSenha: formData.confirmaSenha,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        // fieldErrors vem do Zod (ex: endereço fora da região) — mais
        // específico que o "Dados inválidos" genérico do topo
        const primeiroFieldError = data.fieldErrors
          ? (Object.entries(data.fieldErrors)[0] as [string, string[]] | undefined)
          : undefined
        const campo = data.field ?? primeiroFieldError?.[0] ?? null
        setAccountError(
          primeiroFieldError?.[1]?.[0] ?? data.error ?? 'Não foi possível criar a conta.'
        )
        setAccountErrorField(campo)
        // O erro pode ser de uma etapa anterior (ex: username duplicado)
        // — sem isso a mensagem fica numa etapa que não é mais a visível
        if (campo && FIELD_PARA_ETAPA[campo]) {
          setEtapaIndex(ETAPAS.indexOf(FIELD_PARA_ETAPA[campo]))
        }
        return
      }

      // Foto é opcional e só sobe se a conta já saiu logada (sem
      // confirmação de email pendente) — se não tiver sessão ainda, a
      // pessoa adiciona a foto depois em Meu Perfil. Falha aqui não
      // trava o cadastro, que já deu certo.
      if (foto && data.confirmado) {
        const fotoBody = new FormData()
        fotoBody.set('foto', foto)
        await fetch('/api/perfil/foto', { method: 'POST', body: fotoBody }).catch(() => null)
      }

      setEmailConfirmado(!!data.confirmado)
      setContaCriada(true)
    } catch {
      setAccountError('Erro de conexão. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (contaCriada) {
    return (
      <main className="mx-auto flex max-w-md flex-col items-center gap-4 p-8 text-center">
        <div className="bg-primary-500 flex size-12 items-center justify-center rounded-full text-white">
          <Check className="size-6" />
        </div>
        <div>
          <h1 className="text-primary-500 text-lg font-bold">
            Conta criada!
          </h1>
          <p className="text-muted-foreground text-sm">
            {emailConfirmado
              ? `${formData.nome}, sua conta já está pronta.`
              : `${formData.nome}, falta confirmar. Abra o link que mandamos pro seu email antes de entrar.`}
          </p>
        </div>
        {emailConfirmado ? (
          <div className="flex w-full flex-col gap-2">
            <Button asChild className="w-full">
              <Link href="/cadastro-negocio">Cadastrar meu negócio</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/menu">Ir pro Menu</Link>
            </Button>
          </div>
        ) : (
          <Button asChild className="w-full">
            <Link href="/login">Já confirmei, entrar</Link>
          </Button>
        )}
      </main>
    )
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-4">
      <PageHeader title="Criar Conta" />
      <p className="text-muted-foreground text-center text-sm">
        Pra ter um negócio, sugerir algo ou participar da comunidade
      </p>

      {/* Progresso — segmentos preenchidos até a etapa atual */}
      <div className="flex gap-1.5">
        {ETAPAS.map((e, i) => (
          <div
            key={e}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= etapaIndex ? 'bg-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <form
        onSubmit={etapa === 'foto' ? handleAccountSubmit : (e) => e.preventDefault()}
        className="flex flex-col gap-3"
      >
        {etapa === 'nome' && (
          <>
            <div>
              <label htmlFor="nome" className="text-neutral-text block text-sm font-medium">
                Nome
              </label>
              <Input
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                onBlur={() => handleNomeBlur('nome')}
                placeholder="João"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="sobrenome"
                className="text-neutral-text block text-sm font-medium"
              >
                Sobrenome
              </label>
              <Input
                id="sobrenome"
                name="sobrenome"
                value={formData.sobrenome}
                onChange={handleInputChange}
                onBlur={() => handleNomeBlur('sobrenome')}
                placeholder="Silva"
                required
              />
            </div>

            <div>
              <label
                htmlFor="dataNascimento"
                className="text-neutral-text block text-sm font-medium"
              >
                Data de nascimento
              </label>
              <Input
                id="dataNascimento"
                name="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleInputChange}
                aria-invalid={accountErrorField === 'dataNascimento'}
                required
              />
              {accountErrorField === 'dataNascimento' && (
                <p className="text-destructive mt-1 text-xs">{accountError}</p>
              )}
            </div>
          </>
        )}

        {etapa === 'identificacao' && (
          <>
            <div>
              <label
                htmlFor="username"
                className="text-neutral-text block text-sm font-medium"
              >
                Usuário
              </label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="seu_usuario"
                autoCapitalize="none"
                aria-invalid={accountErrorField === 'username'}
                required
                autoFocus
              />
              <p className="text-muted-foreground mt-1 text-xs">
                É o que você usa pra entrar depois — só letras minúsculas, números e _
              </p>
              {accountErrorField === 'username' && (
                <p className="text-destructive mt-1 text-xs">{accountError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="text-neutral-text block text-sm font-medium"
              >
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu@email.com"
                aria-invalid={accountErrorField === 'email'}
                required
              />
              {accountErrorField === 'email' && (
                <p className="text-destructive mt-1 text-xs">
                  {accountError}{' '}
                  {accountError?.includes('já está cadastrado') && (
                    <Link href="/login" className="underline">
                      Fazer login
                    </Link>
                  )}
                </p>
              )}
            </div>
          </>
        )}

        {etapa === 'contato' && (
          <>
            <div>
              <label
                htmlFor="telefone"
                className="text-neutral-text block text-sm font-medium"
              >
                Telefone
              </label>
              <Input
                id="telefone"
                name="telefone"
                value={formData.telefone}
                onChange={handleTelefoneChange}
                placeholder="(22) 99999-9999"
                maxLength={18}
                aria-invalid={accountErrorField === 'telefone'}
                required
                autoFocus
              />
              {accountErrorField === 'telefone' && (
                <p className="text-destructive mt-1 text-xs">
                  {accountError}{' '}
                  <Link href="/login" className="underline">
                    Fazer login
                  </Link>
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="endereco"
                className="text-neutral-text block text-sm font-medium"
              >
                Endereço
              </label>
              <AddressAutocomplete
                value={formData.endereco}
                placeholder="Comece a digitar o endereço..."
                onChange={(v) => {
                  setFormData((prev) => ({ ...prev, endereco: v }))
                  setEnderecoCoords(null)
                }}
                onPlaceSelected={({ endereco, lat, lng }) => {
                  setFormData((prev) => ({ ...prev, endereco }))
                  setEnderecoCoords({ lat, lng })
                }}
              />
              <p className="text-muted-foreground mt-1 text-xs">
                Só aceitamos endereço em Lumiar, São Pedro da Serra e entorno
              </p>
              {enderecoCoords && (
                <div className="mt-2">
                  <MapEmbed lat={enderecoCoords.lat} lng={enderecoCoords.lng} />
                </div>
              )}
              {accountErrorField === 'endereco' && (
                <p className="text-destructive mt-1 text-xs">{accountError}</p>
              )}
            </div>

            <div className="bg-orange-50 border-orange-200 rounded-lg border p-3">
              <p className="text-orange-800 text-xs">
                ⚠️ Plataforma apenas para <strong>Lumiar</strong> e{' '}
                <strong>São Pedro da Serra</strong>. O endereço é conferido no
                cadastro; fora da região, o cadastro não é aceito.
              </p>
            </div>
          </>
        )}

        {etapa === 'senha' && (
          <>
            <div>
              <label
                htmlFor="senha"
                className="text-neutral-text block text-sm font-medium"
              >
                Senha
              </label>
              <Input
                id="senha"
                name="senha"
                type="password"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="••••••"
                required
                autoFocus
              />
              {formData.senha.length > 0 && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="bg-muted flex h-1 flex-1 gap-1 overflow-hidden rounded-full">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-full flex-1 rounded-full transition-colors ${
                          getPasswordStrength(formData.senha) >= level
                            ? getPasswordStrength(formData.senha) === 1
                              ? 'bg-destructive'
                              : getPasswordStrength(formData.senha) === 2
                                ? 'bg-secondary'
                                : 'bg-primary'
                            : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {PASSWORD_STRENGTH_LABEL[getPasswordStrength(formData.senha)]}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmaSenha"
                className="text-neutral-text block text-sm font-medium"
              >
                Confirmar Senha
              </label>
              <Input
                id="confirmaSenha"
                name="confirmaSenha"
                type="password"
                value={formData.confirmaSenha}
                onChange={handleInputChange}
                placeholder="••••••"
                required
              />
            </div>
          </>
        )}

        {etapa === 'foto' && (
          <>
            <div className="flex justify-center">
              <PhotoCropField
                label="Foto de perfil (opcional)"
                trocarLabel="Trocar foto"
                icon="camera"
                shape="round"
                aspect={1}
                previewClassName="size-20"
                onFileChange={setFoto}
              />
            </div>

            <div className="flex items-start gap-2">
              <input
                id="termos"
                type="checkbox"
                checked={termos}
                onChange={(e) => setTermos(e.target.checked)}
                className="mt-1"
              />
              <label
                htmlFor="termos"
                className="text-muted-foreground text-xs cursor-pointer"
              >
                Aceito os{' '}
                <Link
                  href="/termos"
                  className="text-primary-500 underline hover:no-underline"
                >
                  Termos de Uso
                </Link>{' '}
                e a{' '}
                <Link
                  href="/privacidade"
                  className="text-primary-500 underline hover:no-underline"
                >
                  Política de Privacidade
                </Link>
              </label>
            </div>
          </>
        )}

        {accountError && !accountErrorField && (
          <p className="text-destructive text-xs">{accountError}</p>
        )}

        <div className="flex gap-2">
          {etapaIndex > 0 && (
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={voltar}
              disabled={submitting}
            >
              <ArrowLeft className="size-4" />
              Voltar
            </Button>
          )}
          {etapa === 'foto' ? (
            <Button type="submit" className="flex-1" disabled={submitting}>
              {submitting ? 'Criando conta...' : 'Criar Conta'}
            </Button>
          ) : (
            <Button type="button" className="flex-1" onClick={avancar}>
              Continuar
              <ArrowRight className="size-4" />
            </Button>
          )}
        </div>
      </form>
    </main>
  )
}
