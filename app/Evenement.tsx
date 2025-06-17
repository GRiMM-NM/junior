// ... imports identiques
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const months = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

type Event = {
  id: string;
  nom: string;
  description: string;
  date: string;
  lieu: string;
  type: string;
};

type EventsMap = { [date: string]: Event[] };

export default function Evenement() { 
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const [events, setEvents] = useState<EventsMap>({});
  const [loading, setLoading] = useState(true);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [lieu, setLieu] = useState('');
  const [type, setType] = useState('');

  const bottomBarAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const checkAdmin = async () => {
      const adminValue = await AsyncStorage.getItem("isAdmin");
      setIsAdmin(adminValue === "true");
    };
    checkAdmin();
  }, []);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/getEvenement");
      const json = await res.json();
      const map: EventsMap = {};
      for (const e of json.evenement) {
        const dateKey = e.date_evenement.split('T')[0];
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push({
          id: e.Id_evenement,
          nom: e.nom_evenement,
          description: e.description_evenement,
          date: e.date_evenement,
          lieu: e.lieu,
          type: e.Type_evenement,
        });
      }
      setEvents(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModalForDate = (day: number) => {
    const dk = `2025-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (events[dk]) {
      setSelectedDate(dk);
      setModalVisible(true);
    }
  };

  const handleAddEvent = async () => {
    if (!nom || !description || !date || !lieu || !type) {
      alert("Tous les champs sont requis !");
      return;
    }

    try {
      const res = await fetch('http://172.20.10.13:5001/juniorfirebase-d7603/us-central1/addEvenement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nom_evenement: nom,
          description_evenement: description,
          date_evenement: date,
          lieu: lieu,
          Type_evenement: type,
        }),
      });

      const result = await res.json();
      if (result.success || result.message) {
        alert("Événement ajouté !");
        setNom('');
        setDescription('');
        setDate('');
        setLieu('');
        setType('');
        setLoading(true);
        await fetchEvents();
      } else {
        alert("Erreur lors de l’ajout.");
      }
    } catch (e) {
      console.error(e);
      alert("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const renderCalendar = () => {
    const year = 2025;
    const dim = new Date(year, currentMonthIndex + 1, 0).getDate();
    const arr = Array.from({ length: dim }, (_, i) => i + 1);
    return (
      <>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={() => setCurrentMonthIndex((currentMonthIndex + 11) % 12)}>
            <Text style={styles.navButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{months[currentMonthIndex]} {year}</Text>
          <TouchableOpacity onPress={() => setCurrentMonthIndex((currentMonthIndex + 1) % 12)}>
            <Text style={styles.navButton}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.calendarGrid}>
          {arr.map(day => {
            const key = `${year}-${String(currentMonthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const has = events[key];
            return (
              <TouchableOpacity key={day} style={styles.dayCircle} onPress={() => openModalForDate(day)}>
                <Text style={styles.dayText}>{day}</Text>
                {has && <View style={styles.redDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TouchableWithoutFeedback>
        <ScrollView contentContainerStyle={styles.scroll} scrollEventThrottle={16}>
          <Text style={styles.title}>Événements</Text>
          {loading ? <ActivityIndicator size="large" color="#079BCF" /> : renderCalendar()}

          <View style={{ marginTop: 30 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Événements ce mois-ci</Text>
            {Object.keys(events).filter(date => new Date(date).getMonth() === currentMonthIndex)
              .flatMap(date => events[date])
              .map((ev, index) => {
                const isPast = new Date(ev.date) < new Date();
                return (
                  <View key={index} style={[styles.eventCard, isPast && { backgroundColor: '#ddd' }]}>
                    <Text style={[styles.eventTitle, isPast && { color: '#777' }]}>{ev.nom}</Text>
                    <Text style={[styles.eventDescription, isPast && { color: '#777' }]}>{ev.description}</Text>
                    <TouchableOpacity
                      style={[styles.signupButton, isPast && { backgroundColor: '#aaa' }]}
                      disabled={isPast}
                      onPress={() => alert(`Inscrit à l'événement : ${ev.nom}`)}
                    >
                      <Text style={styles.signupText}>{isPast ? "Événement passé" : "S'inscrire"}</Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
          </View>

          {isAdmin && (
            <View style={{ marginTop: 30, backgroundColor: '#f2f2f2', padding: 15, borderRadius: 12 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: '#075B7A', marginBottom: 10 }}>Ajouter un événement</Text>
              <Text>Nom</Text>
              <TextInput value={nom} onChangeText={setNom} style={styles.input} />
              <Text>Description</Text>
              <TextInput value={description} onChangeText={setDescription} style={styles.input} multiline />
              <Text>Date (YYYY-MM-DD)</Text>
              <TextInput value={date} onChangeText={setDate} style={styles.input} />
              <Text>Lieu</Text>
              <TextInput value={lieu} onChangeText={setLieu} style={styles.input} />
              <Text>Type</Text>
              <TextInput value={type} onChangeText={setType} style={styles.input} />
              <TouchableOpacity style={styles.submitBtn} onPress={handleAddEvent}>
                <Text style={styles.btnText}>Ajouter</Text>
              </TouchableOpacity>
            </View>
          )}

          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalBg}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Événements du {selectedDate}</Text>
                {selectedDate && events[selectedDate]?.map((ev, idx) => {
                  const isPast = new Date(ev.date) < new Date();
                  return (
                    <View key={idx} style={{ marginBottom: 16 }}>
                      <Text style={styles.modalEvent}><Text style={styles.bold}>Nom :</Text> {ev.nom}</Text>
                      <Text style={styles.modalEvent}><Text style={styles.bold}>Description :</Text> {ev.description}</Text>
                      <Text style={styles.modalEvent}><Text style={styles.bold}>Lieu :</Text> {ev.lieu}</Text>
                      <Text style={styles.modalEvent}><Text style={styles.bold}>Type :</Text> {ev.type}</Text>
                      <TouchableOpacity
                        style={[styles.signupButton, isPast && { backgroundColor: '#aaa' }]}
                        disabled={isPast}
                        onPress={() => alert(`Inscrit à l'événement : ${ev.nom}`)}
                      >
                        <Text style={styles.signupText}>{isPast ? "Événement passé" : "S'inscrire"}</Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
                <TouchableOpacity style={styles.closeBtn} onPress={() => {
                  setModalVisible(false);
                  setSelectedDate(null);
                }}>
                  <Text style={styles.btnText}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.bottomBar, { transform: [{ translateY: bottomBarAnim }] }]}>
        <TouchableOpacity onPress={() => router.push('/Profile')}><FontAwesome name="user" size={24} color="#075B7A" /></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Accueil')}><FontAwesome name="home" size={24} color="#075B7A" /></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Articles')}><FontAwesome name="book" size={24} color="#075B7A" /></TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Evenement')}><FontAwesome name="calendar" size={24} color="#075B7A" /></TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 120 },
  title: { fontSize: 22, fontWeight: '600', color: '#079BCF', marginBottom: 12 },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 10,
  },
  submitBtn: {
    backgroundColor: '#079BCF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  btnText: { color: '#fff', fontWeight: 'bold' },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 10 },
  navButton: { fontSize: 18, fontWeight: 'bold', color: '#079BCF' },
  monthTitle: { fontSize: 18, fontWeight: 'bold' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  dayCircle: { width: 40, height: 40, margin: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: '#e6f7ff' },
  dayText: { fontSize: 16 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'red', marginTop: 2 },
  modalBg: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 20, borderRadius: 12, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  modalEvent: { marginBottom: 5 },
  bold: { fontWeight: 'bold' },
  closeBtn: { backgroundColor: '#079BCF', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  bottomBar: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#9BE0F1',
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  eventCard: { backgroundColor: '#E0F7FA', borderRadius: 12, padding: 15, marginBottom: 15 },
  eventTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 6, color: '#075B7A' },
  eventDescription: { fontSize: 14, marginBottom: 10, color: '#333' },
  signupButton: { backgroundColor: '#079BCF', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  signupText: { color: 'white', fontWeight: '600' },
});
