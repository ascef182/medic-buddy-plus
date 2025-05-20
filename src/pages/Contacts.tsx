
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Mail, Phone, Pencil, Trash } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ContactForm from "@/components/ContactForm";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { useMedication } from "@/context/MedicationContext";

const Contacts = () => {
  const { contacts, deleteContact } = useMedication();
  const [isAddContactOpen, setIsAddContactOpen] = useState(false);

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Contatos</h1>
        
        <Dialog open={isAddContactOpen} onOpenChange={setIsAddContactOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Contato
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Contato</DialogTitle>
            </DialogHeader>
            <ContactForm />
          </DialogContent>
        </Dialog>
      </div>

      {contacts.length > 0 ? (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="border-l-4 border-l-primary">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.relation}</p>
                    
                    {contact.email && (
                      <div className="flex items-center mt-2 text-sm">
                        <Mail className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{contact.email}</span>
                      </div>
                    )}
                    
                    {contact.phone && (
                      <div className="flex items-center mt-1 text-sm">
                        <Phone className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover contato</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover {contact.name} da sua lista de contatos?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteContact(contact.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhum contato cadastrado
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Adicionar Contato</DialogTitle>
              </DialogHeader>
              <ContactForm />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </Layout>
  );
};

export default Contacts;
