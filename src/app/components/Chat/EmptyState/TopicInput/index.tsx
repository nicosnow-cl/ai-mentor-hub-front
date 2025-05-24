'use client'

import { IconHelpOctagonFilled } from '@tabler/icons-react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { topicSchema, TopicSchema } from '@/schemas/settings.schema'
import { useUserSettingsStore } from '@/stores/user-settings.store'

export function TopicInput() {
  const { updateSettings, topic } = useUserSettingsStore((state) => state)
  const topicForm = useForm<TopicSchema>({
    resolver: zodResolver(topicSchema),
    values: { topic },
    defaultValues: { topic },
  })

  const onSubmit = (values: Partial<TopicSchema>) => {
    try {
      updateSettings(values)
    } catch (error) {
      console.error('Error al guardar la configuración', error)

      toast.error('Error al guardar la configuración', {
        description: 'No se pudo guardar la configuración del mentor.',
        richColors: true,
      })
    }
  }

  return (
    <Form {...topicForm}>
      <form className="grid w-full place-items-start gap-1.5">
        <FormField
          control={topicForm.control}
          name="topic"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel className="flex items-center gap-x-2" htmlFor="topic">
                Tema
                <TooltipProvider>
                  <Tooltip delayDuration={250}>
                    <TooltipTrigger asChild>
                      <IconHelpOctagonFilled className="size-4" />
                    </TooltipTrigger>

                    <TooltipContent>
                      <p className="text-sm">
                        Este tema se usará para personalizar la conversación con
                        tu mentor.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </FormLabel>

              <FormControl>
                <Input
                  id="topic"
                  {...field}
                  onBlur={(e) => {
                    topicForm.handleSubmit(onSubmit)(e)
                  }}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
