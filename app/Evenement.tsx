import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Keyboard,
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


const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const months = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

type Event = {
  name: string;
  hour: string;
};

type Events = {
  [date: string]: Event[];
};

export default function Evenement() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventHour, setEventHour] = useState('');
  const [events, setEvents] = useState<Events>({});
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(new Date().getMonth());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [editHour, setEditHour] = useState('');
  const router = useRouter();
  const handleAddEvent = () => {
    if (eventDate && eventName && eventHour) {
      setEvents(prev => ({
        ...prev,
        [eventDate]: [...(prev[eventDate] || []), { name: eventName, hour: eventHour }],
      }));
      setEventName('');
      setEventDate('');
      setEventHour('');
    }
  };

  const handleDeleteEvent = () => {
    if (eventDate && events[eventDate]) {
      const updatedEvents = [...events[eventDate]];
      updatedEvents.pop();
      if (updatedEvents.length === 0) {
        const newEvents = { ...events };
        delete newEvents[eventDate];
        setEvents(newEvents);
      } else {
        setEvents(prev => ({ ...prev, [eventDate]: updatedEvents }));
      }
      setEventName('');
      setEventDate('');
      setEventHour('');
    }
  };

  const openEventModal = (day: number) => {
    const dateKey = `2025-${(currentMonthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    if (events[dateKey]) {
      setSelectedDate(dateKey);
      setModalVisible(true);
    }
  };

  const handleStartEdit = (index: number) => {
    if (!selectedDate) return;
    const event = events[selectedDate][index];
    setEditingIndex(index);
    setEditName(event.name);
    setEditHour(event.hour);
  };

  const handleSaveEdit = () => {
    if (selectedDate && editingIndex !== null) {
      const updatedEvents = [...events[selectedDate]];
      updatedEvents[editingIndex] = { name: editName, hour: editHour };
      setEvents(prev => ({ ...prev, [selectedDate]: updatedEvents }));
      setEditingIndex(null);
      setEditName('');
      setEditHour('');
    }
  };

  const renderCalendar = () => {
    const year = 2025;
    const daysInMonth = new Date(year, currentMonthIndex + 1, 0).getDate();
    const month = months[currentMonthIndex];
    const circles = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${(currentMonthIndex + 1).toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`;
      const hasEvent = events[dateKey];
 
      circles.push(
        <TouchableOpacity key={i} style={styles.dayCircle} onPress={() => openEventModal(i)}>
          <Text style={styles.dayText}>{i}</Text>
          {hasEvent && <View style={styles.redDot} />}
        </TouchableOpacity>
      );
    }

    return (
      <>
        <View style={styles.monthNavigation}>
          <TouchableOpacity onPress={() => setCurrentMonthIndex((currentMonthIndex + 11) % 12)}>
            <Text style={styles.navButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.monthTitle}>{month} 2025</Text>
          <TouchableOpacity onPress={() => setCurrentMonthIndex((currentMonthIndex + 1) % 12)}>
            <Text style={styles.navButton}>→</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.calendarGrid}>{circles}</View>
      </>
    );
  };
 
  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={100}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Événements</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daysRow}>
            {days.map((day, index) => (
              <View key={index} style={styles.dayButton}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.calendar}>{renderCalendar()}</View>
          <View style={styles.form}>
            <Text style={styles.label}>Nom de l’événement</Text>
            <TextInput style={styles.input} value={eventName} onChangeText={setEventName} placeholder="Votre événement" />
            <Text style={styles.label}>Date de l’événement (AAAA-MM-JJ)</Text>
            <TextInput style={styles.input} value={eventDate} onChangeText={setEventDate} placeholder="2025-06-15" />
            <Text style={styles.label}>Heure de l’événement</Text>
            <TextInput style={styles.input} value={eventHour} onChangeText={setEventHour} placeholder="14:00" />
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.addButton} onPress={handleAddEvent}>
                <Text style={styles.buttonText}>Ajouter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.addButton, styles.deleteButton]} onPress={handleDeleteEvent}>
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomBar}>
            <TouchableOpacity onPress={() => router.push('/Profile')}>
              <FontAwesome name="user" size={24} color="#075B7A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/Accueil')}>
              <FontAwesome name="home" size={24} color="#075B7A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/Articles')}>
              <FontAwesome name="book" size={24} color="#075B7A" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('/Evenement')}>
              <FontAwesome name="calendar" size={24} color="#075B7A" />
            </TouchableOpacity>
          </View>
          <Modal visible={modalVisible} transparent animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Événements du {selectedDate}</Text>
                {selectedDate && events[selectedDate]?.map((event, idx) => (
                  <View key={idx} style={{ marginBottom: 10 }}>
                    {editingIndex === idx ? (
                      <>
                        <TextInput
                          style={styles.input}
                          value={editHour}
                          onChangeText={setEditHour}
                          placeholder="Heure"
                        />
                        <TextInput
                          style={styles.input}
                          value={editName}
                          onChangeText={setEditName}
                          placeholder="Nom"
                        />
                        <TouchableOpacity style={styles.addButton} onPress={handleSaveEdit}>
                          <Text style={styles.buttonText}>Enregistrer</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <Text style={styles.modalEvent}>{event.hour} - {event.name}</Text>
                        <TouchableOpacity onPress={() => handleStartEdit(idx)}>
                          <Text style={{ color: '#079BCF', fontWeight: '600' }}>✏️ Modifier</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={() => {
                  setModalVisible(false);
                  setEditingIndex(null);
                }} style={styles.modalClose}>
                  <Text style={{ color: '#fff', fontWeight: 'bold' }}>Fermer</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContainer: { paddingTop: 60, paddingHorizontal: 20, paddingBottom: 80 },
  title: { fontSize: 26, fontWeight: '600', color: '#079BCF', textAlign: 'center', marginBottom: 20 },
  daysRow: { marginBottom: 10 },
  dayButton: { backgroundColor: '#DAF4F8', padding: 10, borderRadius: 12, marginRight: 10 },
  dayText: { color: '#079BCF', fontSize: 14, textAlign: 'center' },
  monthNavigation: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  monthTitle: { fontSize: 18, fontWeight: '600', color: '#075B7A', textAlign: 'center' },
  navButton: { fontSize: 24, color: '#075B7A', paddingHorizontal: 10 },
  calendar: { backgroundColor: '#9BE0F1', borderRadius: 16, padding: 20, marginBottom: 20 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  dayCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#C9EDF6', justifyContent: 'center', alignItems: 'center', marginVertical: 6, position: 'relative' },
  redDot: { position: 'absolute', bottom: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: 'red' },
  form: { backgroundColor: '#F4FBFE', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 4 },
  label: { color: '#075B7A', marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#D4F4FB', borderRadius: 12, paddingHorizontal: 15, paddingVertical: 10, marginBottom: 10 },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  addButton: { backgroundColor: '#079BCF', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 50, marginTop: 5 },
  deleteButton: { backgroundColor: '#F55' },
  buttonText: { color: 'white', fontWeight: '600' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#D1D9DE', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: -3 } },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: 'white', borderRadius: 20, padding: 20, width: '85%', alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#075B7A' },
  modalEvent: { fontSize: 16, color: '#333', marginBottom: 5 },
  modalClose: { marginTop: 15, backgroundColor: '#079BCF', paddingVertical: 8, paddingHorizontal: 20, borderRadius: 10 },
});