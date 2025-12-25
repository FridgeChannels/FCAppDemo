// Homepage - redirects to screen1
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/screen1');
}

