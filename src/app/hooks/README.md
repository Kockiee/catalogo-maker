# Sistema de Notificações

Este documento explica como usar o novo sistema de notificações aprimorado.

## Visão Geral

O sistema de notificações foi redesenhado para ser mais simples, reutilizável e consistente em toda a aplicação. Ele inclui:

- **Contexto de Notificações**: Gerencia o estado global das notificações
- **Hook personalizado**: `useNotifications()` para facilitar o uso
- **Componentes**: `NotificationItem` e `NotificationContainer` para renderização
- **Mensagens pré-definidas**: Métodos de conveniência para ações comuns

## Como Usar

### 1. Importar o Hook

```javascript
import { useNotifications } from '../hooks/useNotifications';
```

### 2. Usar no Componente

```javascript
function MeuComponente() {
  const { notify } = useNotifications();

  const handleAction = async () => {
    try {
      notify.processing("Processando...");
      await minhaAcao();
      notify.success("Ação realizada com sucesso!");
    } catch (error) {
      notify.error("Erro ao realizar ação");
    }
  };

  return (
    <button onClick={handleAction}>
      Executar Ação
    </button>
  );
}
```

## Métodos Disponíveis

### Métodos de Conveniência (Recomendados)

#### Sucesso
- `notify.productCreated()` - Produto criado com sucesso
- `notify.productUpdated()` - Produto atualizado com sucesso
- `notify.productDeleted()` - Produto(s) excluído(s) com sucesso
- `notify.catalogCreated()` - Catálogo criado com sucesso
- `notify.catalogUpdated()` - Catálogo atualizado com sucesso
- `notify.catalogDeleted()` - Catálogo(s) excluído(s) com sucesso
- `notify.orderCreated()` - Pedido enviado com sucesso
- `notify.orderAccepted()` - Pedido aceito com sucesso
- `notify.orderRefused()` - Pedido recusado com sucesso
- `notify.accountDeleted()` - Conta excluída com sucesso
- `notify.dataSaved()` - Dados salvos com sucesso
- `notify.copiedToClipboard()` - Copiado para a área de transferência

#### Erro
- `notify.productCreationFailed()` - Erro ao criar produto
- `notify.productUpdateFailed()` - Erro ao atualizar produto
- `notify.productDeletionFailed()` - Erro ao excluir produto(s)
- `notify.catalogCreationFailed()` - Erro ao criar catálogo
- `notify.catalogUpdateFailed()` - Erro ao atualizar catálogo
- `notify.catalogDeletionFailed()` - Erro ao excluir catálogo(s)
- `notify.orderCreationFailed()` - Erro ao enviar pedido
- `notify.orderUpdateFailed()` - Erro ao atualizar pedido
- `notify.accountDeletionFailed()` - Erro ao excluir conta
- `notify.saveFailed()` - Erro ao salvar dados
- `notify.networkError()` - Erro de conexão
- `notify.invalidData()` - Dados inválidos
- `notify.unauthorized()` - Acesso negado

#### Aviso
- `notify.loading(message)` - Carregando (padrão: "Carregando...")
- `notify.processing(message)` - Processando (padrão: "Processando...")
- `notify.noProductsSelected()` - Nenhum produto selecionado
- `notify.noCatalogsSelected()` - Nenhum catálogo selecionado
- `notify.imageRequired()` - Imagem necessária
- `notify.phoneRequired()` - Telefone necessário
- `notify.nameRequired()` - Nome necessário
- `notify.priceRequired()` - Preço necessário

#### Info
- `notify.selectItems()` - Selecione os itens
- `notify.changesNotSaved()` - Alterações não salvas
- `notify.comingSoon()` - Funcionalidade em breve
- `notify.maintenance()` - Sistema em manutenção

### Métodos Genéricos

```javascript
// Métodos diretos
notify.success("Mensagem de sucesso");
notify.error("Mensagem de erro");
notify.warning("Mensagem de aviso");
notify.info("Mensagem informativa");

// Método customizado
notify.custom("success", "Mensagem customizada", { duration: 3000 });
```

## Opções Avançadas

### Duração Personalizada

```javascript
// Notificação que não desaparece automaticamente
notify.processing("Processando...", { duration: 0 });

// Notificação com duração personalizada
notify.success("Sucesso!", { duration: 3000 });
```

### Múltiplas Notificações

```javascript
const { notify, removeNotification, clearAllNotifications } = useNotifications();

// Remover notificação específica
const notificationId = notify.info("Processando...", { duration: 0 });
removeNotification(notificationId);

// Limpar todas as notificações
clearAllNotifications();
```

## Migração do Sistema Antigo

### Antes (Sistema Antigo)
```javascript
const [notification, setNotification] = useState(<></>);

// Mostrar notificação
setNotification(<Notification setPattern={setNotification} type="success" message="Sucesso!"/>);

// Remover notificação
setNotification(<></>);
```

### Depois (Sistema Novo)
```javascript
const { notify } = useNotifications();

// Mostrar notificação
notify.success("Sucesso!");

// Notificações são removidas automaticamente
```

## Exemplos Práticos

### Formulário com Validação
```javascript
const handleSubmit = async (formData) => {
  if (!formData.name) {
    notify.nameRequired();
    return;
  }
  
  if (!formData.image) {
    notify.imageRequired();
    return;
  }

  try {
    notify.processing("Criando produto...");
    await createProduct(formData);
    notify.productCreated();
  } catch (error) {
    notify.productCreationFailed();
  }
};
```

### Ação de Exclusão
```javascript
const handleDelete = async (items) => {
  if (items.length === 0) {
    notify.noProductsSelected();
    return;
  }

  try {
    notify.processing("Excluindo itens...");
    await deleteItems(items);
    notify.productDeleted();
  } catch (error) {
    notify.productDeletionFailed();
  }
};
```

### Operação de Rede
```javascript
const fetchData = async () => {
  try {
    notify.loading("Carregando dados...");
    const data = await api.getData();
    notify.success("Dados carregados!");
    return data;
  } catch (error) {
    if (error.code === 'NETWORK_ERROR') {
      notify.networkError();
    } else {
      notify.error("Erro ao carregar dados");
    }
  }
};
```

## Benefícios

1. **Consistência**: Todas as notificações seguem o mesmo padrão visual
2. **Simplicidade**: Uma linha de código para mostrar notificações
3. **Reutilização**: Mensagens pré-definidas para ações comuns
4. **Flexibilidade**: Suporte a notificações customizadas
5. **Manutenibilidade**: Centralizado e fácil de atualizar
6. **UX Melhorada**: Notificações automáticas com duração apropriada
7. **Acessibilidade**: Suporte a leitores de tela e navegação por teclado
