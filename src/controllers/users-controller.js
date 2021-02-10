import { User } from '../models/user';

// kontroler za dohvat svih korisnika
// svaki kontroler koji se pozove preko Routera dobiva kao parametre req i res
// koji predstavljaju Request i Response http objekte.
export async function handleGetUsers(req, res) {
  let userDetails;

  // poziv nad bazom se wrappa u try, catch blok kako bi se uhvatio bilo
  // kakav error i poslao nazad korisniku.
  try {
    // funkcija find vraca listu svih korisnika i exec izvrsava tu naredbu.
    const users = await User.find().exec();
    userDetails = users.map((user) => ({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    }));
  } catch (err) {
    // u response se stavlja error i vraca korisniku
    return res.send(err);
  }

  // inace se vracaju korisnici
  return res.send(userDetails);
}

// kontroler za brisanje korisnika
export async function handleDeleteUser(req, res) {
  // iz params se izvlaci id korisnika kojeg se zeli obrisati, na frontendu url poziva
  // izgleda ovako `http://localhost:4000/users/${id}`
  const { id } = req.params;

  try {
    // funkcija remove prima id korisnika kojeg zelimo obrisati
    await User.remove({ _id: id });
  } catch (err) {
    return res.send(err);
  }

  // vracamo nazad id izbrisanog korisnika ukoliko je sve proslo dobro
  return res.send(id);
}

// slicno kao i za delete sto se tice urla poziva na frontendu, ponovo nam je potreban id
// da bi pronasli korisnika kojeg zelimo updateati
export async function handleUpdateUser(req, res) {
  const { id } = req.params;

  // iz bodya poziva izvlacimo ostale vrijednosti
  const { email = '', firstName = '', lastName = '' } = req.body;

  // funkcija updateOne kao prvi parametar prima id korisnika kojeg zelimo updatetati,
  // a kao drugi pod kljucem $set prima objekt sa novim vrijednostima
  await User.updateOne({ _id: id }, { $set: { email, firstName, lastName } });

  // vracamo nazad id izbrisanog korisnika ukoliko je sve proslo dobro
  return res.send(id);
}

// isto kao i delete, samo sto ne brisemo korisnika, nego ga vracamo korisniku
// ako postoji
export async function handleGetUser(req, res) {
  const { id } = req.params;

  const user = await User.findOne({ _id: id });

  return res.send(user);
}
