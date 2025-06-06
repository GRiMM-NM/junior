import { UserContext } from '@/UserContext';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { JSX, useContext } from 'react';
import {
  ActionSheetIOS,
  Alert,
  Image,
  ImageSourcePropType,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

type RootStackParamList = {
  ModifierProfil: undefined;
  MissionsRecemment: undefined;
  Confidentialite: undefined;
  Aide: undefined;
  Deconnexion: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OptionProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}

export default function ProfilScreen(): JSX.Element {
  const router = useRouter();
  const context = useContext(UserContext);
  if (!context) throw new Error("ProfilScreen must be wrapped in a UserProvider");
  const { imageUri, setImageUri } = context;
  const navigation = useNavigation<NavigationProp>();

  const pickImage = async () => {
    const openCamera = async () => {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "Autorisez l'accès à l'appareil photo.");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    const openGallery = async () => {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Permission refusée", "Autorisez l'accès à vos photos.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Annuler', 'Prendre une photo', 'Choisir depuis la galerie'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) openCamera();
          else if (buttonIndex === 2) openGallery();
        }
      );
    } else {
      Alert.alert('Choisir une image', '', [
        { text: 'Prendre une photo', onPress: openCamera },
        { text: 'Galerie', onPress: openGallery },
        { text: 'Annuler', style: 'cancel' },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mon Profil</Text>

      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
          {imageUri ? (
            <Image source={{ uri: imageUri } as ImageSourcePropType} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <FontAwesome name="user" size={60} color="#9BB1BC" />
            </View>
          )}
        </TouchableOpacity>
        <Text style={styles.editPhoto}>Modifier la photo</Text>
      </View>

      <ScrollView style={styles.options} showsVerticalScrollIndicator={false}>
        <Option
          icon={<FontAwesome name="user" size={24} color="#075B7A" />}
          label="Modifier le profil"
          onPress={() => router.push('/modifierProfil')}
        />
        <Option
          icon={<FontAwesome name="history" size={24} color="#075B7A" />}
          label="Missions récemment consultées"
          onPress={() => router.push('/HistoriqueScreen')}
        />
        <Option
          icon={<FontAwesome name="lock" size={24} color="#075B7A" />}
          label="Confidentialité du compte"
          onPress={() => router.push('/ConfidentialiteScreen')}
        />
        <Option
          icon={<FontAwesome name="question-circle" size={24} color="#075B7A" />}
          label="Aide"
          onPress={() => router.push('/AideScreen')}
        />
        <Option
          icon={<FontAwesome name="sign-out" size={24} color="#D9534F" />}
          label="Se déconnecter"
          onPress={() => router.push('/deconnexionScreen')}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity onPress={() => router.push('/Profile')}>
          <FontAwesome name="user" size={28} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Accueil')}>
          <FontAwesome name="home" size={28} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Articles')}>
          <FontAwesome name="book" size={28} color="#075B7A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/Evenement')}>
          <FontAwesome name="calendar" size={28} color="#075B7A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const Option: React.FC<OptionProps> = ({ icon, label, onPress }) => {
  return (
    <TouchableOpacity style={styles.optionRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.optionLabel}>{label}</Text>
      <Feather name="chevron-right" size={20} color="#075B7A" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FCFD',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#075B7A',
    marginBottom: 20,
    alignSelf: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#075B7A',
    resizeMode: 'cover',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#DDE7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editPhoto: {
    marginTop: 8,
    color: '#075B7A',
    fontSize: 16,
    fontWeight: '600',
  },
  options: {
    flex: 1,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F1F4',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    marginRight: 15,
  },
  optionLabel: {
    flex: 1,
    fontSize: 17,
    color: '#075B7A',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 65,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#D1D9DE',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
  },
});
