'use client'

import { IconMessages, IconUser, IconVector } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { SettingsSchema, settingsSchema } from '@/schemas/settings.schema'
import { Textarea } from '@/components/ui/textarea'
import { useUserSettingsStore } from '@/stores/user-settings.store'

export function Settings() {
  const { updateSettings, ...restState } = useUserSettingsStore(
    (state) => state
  )
  const settingsForm = useForm<SettingsSchema>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      mentorName: restState.mentorName,
      instructions: restState.instructions,
      topic: restState.topic,
      subTopic: restState.subTopic,
      language: restState.language,
      userName: restState.userName,
    },
  })

  const onSubmit = (values: SettingsSchema) => {
    try {
      updateSettings(values)

      toast.success('Configuración guardada', {
        description:
          'La configuración del mentor ha sido guardada correctamente.',
      })
    } catch (error) {
      console.error('Error al guardar la configuración', error)

      toast.error('Error al guardar la configuración', {
        description: 'No se pudo guardar la configuración del mentor.',
        richColors: true,
      })
    }
  }

  return (
    <Form {...settingsForm}>
      <form
        onSubmit={settingsForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-8"
      >
        <div className="space-y-3">
          <span className="flex items-center gap-x-2 font-bold text-indigo-200">
            <IconVector className="size-5" /> Mentor
          </span>

          <FormField
            control={settingsForm.control}
            name="mentorName"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Nombre</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormDescription>
                  El nombre de tu mentor personalizado.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={settingsForm.control}
            name="instructions"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>
                  Instrucciones <i className="text-xs">- opcional</i>
                </FormLabel>

                <FormControl>
                  <Textarea className="max-h-52" rows={8} {...field} />
                </FormControl>

                <FormDescription>
                  Son las instrucciones y reglas personalizadas que el mentor
                  debe seguir durante una conversación.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <span className="flex items-center gap-x-2 font-bold text-indigo-200">
            <IconMessages className="size-5" /> Conversación
          </span>

          <FormField
            control={settingsForm.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Tema</FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormDescription>
                  Este es el tema principal de la conversación.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={settingsForm.control}
            name="subTopic"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>
                  Subtema <i className="text-xs">- opcional</i>
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormDescription>
                  Si lo necesitas, puedes agregar un subtema especifico en el
                  que profundizar.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={settingsForm.control}
            name="language"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>Idioma</FormLabel>

                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    <SelectItem value="spanish">Español</SelectItem>
                    <SelectItem value="english">Ingles</SelectItem>
                  </SelectContent>
                </Select>

                <FormDescription>
                  Este es el idioma en el que se desarrollara la conversación.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <span className="flex items-center gap-x-2 font-bold text-indigo-200">
            <IconUser /> Usuario
          </span>

          <FormField
            control={settingsForm.control}
            name="userName"
            render={({ field }) => (
              <FormItem className="px-2">
                <FormLabel>
                  Nombre <i className="text-xs">- opcional</i>
                </FormLabel>

                <FormControl>
                  <Input {...field} />
                </FormControl>

                <FormDescription>
                  El nombre que el mentor usara para referirse a ti.
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="ml-auto">
          Guardar
        </Button>
      </form>
    </Form>
  )
}
