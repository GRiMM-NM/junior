import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
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

export default function Evenement() {
    const [selectedDate, setSelectedDate] = useState<number | null>(null);
    const [eventName, setEventName] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventHour, setEventHour] = useState('');
    const router = useRouter();
    const [events, setEvents] = useState<{ [date: string]: { name: string; hour: string } }>({});

  const handleAddEvent = () => {
    if (eventDate && eventName && eventHour) {
      setEvents(prev => ({
        ...prev,
        [eventDate]: { name: eventName, hour: eventHour },
      }));
      setEventName('');
      setEventDate('');
      setEventHour('');
    }
  };

  const handleDeleteEvent = () => {
    if (eventDate && events[eventDate]) {
      const newEvents = { ...events };
      delete newEvents[eventDate];
      setEvents(newEvents);
      setEventName('');
      setEventDate('');
      setEventHour('');
    }
  };

  const renderCalendar = () => {
    const year = 2025;
    const monthIndex = 5;
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const month = months[monthIndex];

    const circles = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dateKey = `${year}-${(monthIndex + 1).toString().padStart(2, '0')}-${i
        .toString()
        .padStart(2, '0')}`;
      const hasEvent = events[dateKey];

      circles.push(
        <TouchableOpacity key={i} style={styles.dayCircle} onPress={() => setSelectedDate(i)}>
          <Text style={styles.dayText}>{i}</Text>
          {hasEvent && <View style={styles.redDot} />}
        </TouchableOpacity>
      );
    }

    return (
      <>
        <Text style={styles.monthTitle}>{month} {year}</Text>
        <View style={styles.calendarGrid}>{circles}</View>
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
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

          <View style={styles.calendar}>
            {renderCalendar()}
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Nom de l’événement</Text>
            <TextInput
              style={styles.input}
              value={eventName}
              onChangeText={setEventName}
              placeholder="Votre événement"
            />

            <Text style={styles.label}>Date de l’événement (AAAA-MM-JJ)</Text>
            <TextInput
              style={styles.input}
              value={eventDate}
              onChangeText={setEventDate}
              placeholder="2025-06-15"
            />

            <Text style={styles.label}>Heure de l’événement</Text>
            <TextInput
              style={styles.input}
              value={eventHour}
              onChangeText={setEventHour}
              placeholder="14:00"
            />

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
            <FontAwesome name="user" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Accueil')}>
            <FontAwesome name="home" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Articles')}>
            <FontAwesome name="book" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Evenement')}>
            <FontAwesome name="calendar" size={24} color="black" />
        </TouchableOpacity>
      </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#079BCF',
    textAlign: 'center',
    marginBottom: 20,
  },
  daysRow: {
    marginBottom: 10,
  },
  dayButton: {
    backgroundColor: '#DAF4F8',
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
  },
  dayText: {
    color: '#079BCF',
    fontSize: 14,
    textAlign: 'center',
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#075B7A',
    textAlign: 'center',
    marginBottom: 10,
  },
  calendar: {
    backgroundColor: '#9BE0F1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  dayCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#C9EDF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    bottom: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
  },
  form: {
    backgroundColor: '#F4FBFE',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  label: {
    color: '#075B7A',
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#D4F4FB',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#079BCF',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 50,
  },
  deleteButton: {
    backgroundColor: '#F55',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
    bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 8,
  },
});
